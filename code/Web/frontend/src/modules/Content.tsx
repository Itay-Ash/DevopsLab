import * as React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import LooksThreeIcon from '@mui/icons-material/Looks3';
import LooksFourIcon from '@mui/icons-material/Looks4';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ButtonProps } from "@mui/material";
import './Content.css';
import { getFirstQuestion, getEmptyQuestion, getQuestion } from '../helpers/GetQuestion';

export default function Content() {
  
  return (
    <React.Fragment>
      <div className='bg-image'>
      </div>
      <div className='question-container'>
      <QuestionCard />
      </div>
    </React.Fragment>
  );
}

function QuestionCard({  }) {
  const [questionData, setQuestionData] = React.useState(getEmptyQuestion());
  const [correctQuestions, setCorrectQuestions] = React.useState(0);
  const [totalQuestions, setTotalQuestions] = React.useState(0);
  const [wrongQuestions, setWrongQuestions] = React.useState(0);
  const [optionsState, setOptionsState] = React.useState<{
    A: { color: ButtonProps["color"]; disabled: boolean };
    B: { color: ButtonProps["color"]; disabled: boolean };
    C: { color: ButtonProps["color"]; disabled: boolean };
    D: { color: ButtonProps["color"]; disabled: boolean };
  }>({
    A: { color: "primary", disabled: false },
    B: { color: "primary", disabled: false },
    C: { color: "primary", disabled: false },
    D: { color: "primary", disabled: false },
  });
  


  React.useEffect(() => {
    async function fetchData() {
      const question = await getFirstQuestion();
      setQuestionData(question);
    }
    fetchData();
  }, []);

  function handleRestartButtonClick(event: React.MouseEvent<HTMLElement>) {
    window.location.reload();
  }

  function handleNextQuestion(event: React.MouseEvent<HTMLElement>){
    async function fetchData() {
      const question = await getQuestion();
      setQuestionData(question);
      if (JSON.stringify(question) === JSON.stringify(getEmptyQuestion())){
        question.question = 'Game Over!';
        setOptionsState({
          A: { color: "primary", disabled: true },
          B: { color: "primary", disabled: true },
          C: { color: "primary", disabled: true },
          D: { color: "primary", disabled: true },
        });
      }
    }
    updateOptionColor('ALL', "primary");
    fetchData();
  }

  function handleOptionClick(event: React.MouseEvent<HTMLElement>){
    let status: ButtonProps["color"];
    if(event.currentTarget.dataset.value == questionData.correct_option){
      status = "success";
      setCorrectQuestions(correctQuestions + 1);
    }else{
      status = "error";
      setWrongQuestions(wrongQuestions + 1);
    }
    setTotalQuestions(totalQuestions + 1);
    updateOptionColor(String(event.currentTarget.dataset.value), status);
  }

  function updateOptionColor(option: string, color: ButtonProps["color"]) {
    switch (option) {
      case 'A':
        setOptionsState({
          A: { color: color, disabled: false },
          B: { color: "primary", disabled: true },
          C: { color: "primary", disabled: true },
          D: { color: "primary", disabled: true },
        });
        break;
      case 'B':
        setOptionsState({
          A: { color: "primary", disabled: true },
          B: { color:  color, disabled: false },
          C: { color: "primary", disabled: true },
          D: { color: "primary", disabled: true },
        });
        break;
      case 'C':
        setOptionsState({
          A: { color: "primary", disabled: true },
          B: { color: "primary", disabled: true },
          C: { color: color, disabled: false },
          D: { color: "primary", disabled: true },
        });
        break;
      case 'D':
        setOptionsState({
          A: { color: "primary", disabled: true },
          B: { color: "primary", disabled: true },
          C: { color: "primary", disabled: true },
          D: { color: color, disabled: false },
        });
        break;
      case 'ALL':
        setOptionsState({
          A: { color: "primary", disabled: false },
          B: { color: "primary", disabled: false },
          C: { color: "primary", disabled: false },
          D: { color: "primary", disabled: false },
        });
      default:
    }
  }

  const statsFabStyles = {
    ml: '5%', 
    mr: '5%', 
    fontSize: { xs: '0.75rem', md: "0.875rem" },
    minWidth: { xs: '20px', md: "30px" } ,
    minHeight: { xs: '20px', md: "30px" },
    maxWidth: { xs: ' 40px', md: "500px" } ,
    maxHeight: { xs: '40px', md: "500px" },
    width: "4em",
    height: "4em",
  }
  const optionButtonGroupStyles = {
    m: 'auto',
    mb: '2%',
    boxShadow: "none",
    display: "flex",
    flex: "2 1 auto",
    columnGap: 1,
    justifyContent: "center",
    minWidth: { xs: '20px', md: "30px" } ,
    minHeight: { xs: '20px', md: "30px" },
    maxWidth: { xs: ' 450px', md: "100vw" } ,
    maxHeight: { xs: '32px', md: "100vh" },
  };
  const optionButtonStyles = {
    width: '100%',
    justifyContent: "flex-start",
    fontSize: '2vh'
  }
  const actionButtonGroupStyles = {
    m: 'auto',
    width: '50%',
    minWidth: '500px',
    display: "flex",
    flex: "2 1 auto",
    columnGap: 1,
    justifyContent: "center",
  };
  const actionButtonStyles = {
    color: 'white',
    minWidth: "60px",
    minHeight: "30px",
    width: { xs: '100%', md: "15em" },
    height: "4em",
    borderWidth: '0.2vw',
    fontSize: '1.5vh',
  }
  return (
    <React.Fragment>
      <Box sx={{height: '10vh'}}>
      <h1>{questionData.question}</h1>
      </Box>
      <Box sx={{m: 5}}>
        <Fab color="success" aria-label="correct-questions-stat" sx={statsFabStyles}>
          {correctQuestions}
        </Fab>
        <Fab aria-label="total-questions-stat" sx={statsFabStyles}>
          {totalQuestions}
        </Fab>
        <Fab color="error" aria-label="wrong-questions-stat" sx={statsFabStyles}>
          {wrongQuestions}
        </Fab>
      </Box>
      <ButtonGroup variant="contained" aria-label="Options" sx={optionButtonGroupStyles}>
        <Button data-value='A' startIcon={<LooksOneIcon />} sx={optionButtonStyles} onClick={handleOptionClick} disabled={optionsState.A.disabled} color={optionsState.A.color}>
        {questionData.option_a}
        </Button>
        <Button data-value='B' startIcon={<LooksTwoIcon />} sx={optionButtonStyles} onClick={handleOptionClick} disabled={optionsState.B.disabled} color={optionsState.B.color}>
        {questionData.option_b}
        </Button>
        </ButtonGroup>
        <ButtonGroup variant="contained" aria-label="Options" sx={optionButtonGroupStyles} >
        <Button data-value='C' startIcon={<LooksThreeIcon />} sx={optionButtonStyles} onClick={handleOptionClick} disabled={optionsState.C.disabled} color={optionsState.C.color}>
        {questionData.option_c}
        </Button>
        <Button data-value='D' startIcon={<LooksFourIcon />} sx={optionButtonStyles} onClick={handleOptionClick} disabled={optionsState.D.disabled} color={optionsState.D.color}>
        {questionData.option_d}
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="outlined" sx={actionButtonGroupStyles}>
      <Box sx={{display: { xs: 'none', md: 'block' }}}>
        <Button endIcon={<RestartAltIcon />} sx={actionButtonStyles} onClick={handleRestartButtonClick}>
          Restart
        </Button>
      </Box>
      <Button endIcon={<SendIcon />} sx={actionButtonStyles} onClick={handleNextQuestion}>
        Next Question
      </Button>
      </ButtonGroup>
    </React.Fragment>
  );
}