import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { linearConfigQuery } from '../utils/linearConfigQuery';
import { oxfordJoinArray } from '../utils/oxfordJoinArray';
import { Button } from './Button';
import Input from './Input';
import ChevronBack from '../assets/svg/ChevronBack.svg';

const ErrorMessage = styled.p`
  width: 100%100%;
  padding: 0px 32px;
  text-align: center;
  color: #c54343;
`;

const StyledH3 = styled.h3`
  font-style: normal;
  line-height: normal;
  color: rgb(247, 248, 248);
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 16px;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 700px;
  width: 100%;
`;

const SelectItem = styled.div`
  color: rgb(215, 216, 219);
  cursor: pointer;
  font-style: normal;
  line-height: normal;
  color: rgb(215, 216, 219);
  font-weight: 500;
  font-size: 13px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-flex: 1;
  flex-grow: 1;
  height: 32px;
  border-radius: 4px;
  padding: 0px 8px;
  border-bottom: 1px solid rgb(31, 32, 35);
  &:hover {
    background-color: rgb(45, 47, 54);
  }
`;

const Description = styled.span`
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0px;
`;

const OutputContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  padding: 16px;
  padding-top: 0;
  margin-bottom: 16px;
`;

const OutputTitle = styled.p`
  font-size: 12px;
  text-align: center;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding: 6px;
`;

const BackButton = styled(Button)`
  background: none;
  border: 1px solid transparent;
  box-shadow: none;
  padding-left: 6px;
  svg {
    height: 30px;
  }
  &:hover {
    background: none;
    border: 1px solid rgb(110, 121, 214);
  }
`;

const CodeToCopy = styled.div`
  white-space: pre;
  overflow: scroll;
  padding-top: 8px;
  padding-bottom: 8px;
  scrollbar-color: dark;
  ::-webkit-scrollbar {
    height: 3px;
    width: 3px;
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    -webkit-border-radius: 1ex;
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const ConfigFileGenerator = () => {
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('input-api-token');
  const [rawLinearResponse, setRawLinearResponse] = useState();
  const [config, setConfig] = useState({});
  const [team, setTeam] = useState();
  const [project, setProject] = useState();
  const [inbox, setInbox] = useState();
  const [defaultAssignee, setDefaultAssignee] = useState();
  const [finalConfigEnvString, setFinalConfigEnvString] = useState();

  const resetForm = () => {
    setApiToken('');
    setError('');
    setStep('input-api-token');
    setRawLinearResponse();
    setConfig({});
    setTeam();
    setProject();
    setInbox();
    setDefaultAssignee();
  };

  const copyConfigToClipboard = () => {
    navigator.clipboard.writeText(finalConfigEnvString);
  };

  const getLinearConfig = async () => {
    setError('');
    try {
      let response = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: linearConfigQuery }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiToken,
        },
      });
      let jsonResponse = await response.json();

      if (jsonResponse.errors) {
        const newErrorMessage = oxfordJoinArray(
          jsonResponse.errors.map((err) => err.message),
          'and',
          'Unknown Error'
        );
        setError(newErrorMessage);
      } else {
        setError('');
        setStep('select-team');
        setRawLinearResponse(jsonResponse);
      }
    } catch (err) {
      setError('Unable to reach Linear API :(');
      console.error(err);
    }
  };

  const nextStep = (value) => {
    switch (step) {
      case 'select-team':
        setTeam(value);
        setStep('select-project');
        break;
      case 'select-project':
        setProject(value);
        setStep('select-inbox');
        break;
      case 'select-inbox':
        setInbox(value);
        setStep('select-defaultAssignee');
        break;
      case 'select-defaultAssignee':
        setDefaultAssignee(value);
        setStep('output');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (step === 'output') {
      const labels = {};
      for (let label of team.labels.nodes) {
        labels[label.name.toLowerCase()] = label.id;
      }
      const newConfigObject = {
        teamId: team.id,
        projectId: project.id,
        defaultAssignee: defaultAssignee.id,
        inboxStateId: inbox.id,
        labels,
      };
      setConfig(newConfigObject);
    }
  }, [step, defaultAssignee]);

  useEffect(() => {
    setFinalConfigEnvString(
      `LINEAR_API_TOKEN="${apiToken}"\nLINEAR_CONFIG='${JSON.stringify(
        config
      )}'`
    );
  }, [config]);

  switch (step) {
    case 'input-api-token':
      return (
        <Container>
          <Input
            value={apiToken}
            onChange={setApiToken}
            placeholder='Your Linear API Token'
            buttonText='Get Config File'
            onButtonClick={getLinearConfig}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
      );
      break;
    case 'select-team':
      return (
        <Container>
          <StyledH3>Select Team</StyledH3>
          <SelectContainer>
            {rawLinearResponse?.data?.teams?.nodes?.map((item, i) => (
              <SelectItem onClick={() => nextStep(item)} key={i}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
      );
      break;
    case 'select-project':
      return (
        <Container>
          <StyledH3>Select Project</StyledH3>
          <SelectContainer>
            {team?.projects?.nodes?.map((item, i) => (
              <SelectItem onClick={() => nextStep(item)} key={i}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
      );
      break;

    case 'select-inbox':
      return (
        <Container>
          <StyledH3>
            Select Inbox{' '}
            <Description>
              (Where the tickets will be placed upon creation)
            </Description>
          </StyledH3>

          <SelectContainer>
            {team?.states?.nodes?.map((item, i) => (
              <SelectItem onClick={() => nextStep(item)} key={i}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
      );
      break;
    case 'select-defaultAssignee':
      return (
        <Container>
          <StyledH3>Select Default Ticket Assignee</StyledH3>
          <SelectContainer>
            {rawLinearResponse?.data?.users?.nodes?.map((item, i) => (
              <SelectItem onClick={() => nextStep(item)} key={i}>
                {item.name}
              </SelectItem>
            ))}
            <SelectItem onClick={() => nextStep({ id: '', name: 'none' })}>
              None
            </SelectItem>
          </SelectContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
      );
      break;
    case 'output':
      return (
        <Container>
          <BackButton onClick={resetForm}>
            <ChevronBack />
            Restart
          </BackButton>
          <OutputContainer>
            <OutputTitle>.env</OutputTitle>
            <CodeToCopy>{finalConfigEnvString}</CodeToCopy>
          </OutputContainer>
          <Button onClick={copyConfigToClipboard}>Copy To Clipboard</Button>
        </Container>
      );
      break;
    default:
      return <>{step}</>;
      break;
  }
};

export default ConfigFileGenerator;
