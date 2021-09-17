import React, { useState, useEffect } from "react";
import data from "./QuizData";
import { Box, Select, Button, FormControl, InputLabel, FormControlLabel, RadioGroup, Radio, FormLabel } from "@material-ui/core";
import Timer from "./Timer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container:{
        border: "1px solid",
        margin: "20px",
        height:"100%"
    },

    instBg:{
        background:"yellow",
        margin:"15px",
        fontWeight:"500"
    },

    qstnBg:{
        background:"yellow",
        padding:"15px 0px 15px 0px"
    },
    correctBg:{
        backgroundColor:"#3CB371",
        margin:"15px",
        fontWeight:"500"

    },
    wrongBg:{
        backgroundColor:"#FA8072",
        margin:"15px",
        fontWeight:"500"
    }


}));

function Quiz() {
    const [level, setLevel] = useState("easy")
    const [showQuetions, setShowQuetions] = useState(false)
    const [answers, setAnswers] = useState({})
    const [showReport, setShowReport] = useState(false)
    const [index, setIndex] = useState(0)
    let timeoutId;
    const [progress, setProgress] = useState(30);

    const classes = useStyles()

    const getResult = () => {
        let mark = 0;
        data[level].map(qns => {
            if (answers[qns.id] == qns.ans) mark++
        })
        switch (mark) {
            case 0:
            case 1: return "Poor"
            case 2: return "Bad"
            case 3: return "Good"
            case 4: return "Strong"
            case 5: return "Very Strong"
        }
    }
    useEffect(() => {
        if (showQuetions) {
            const timer = setInterval((progress) => {
                setProgress((prevProgress) => (prevProgress == 0 && progress == 30 ? 30 : prevProgress - 1));
            }, 1000, progress);
            return () => {
                clearInterval(timer);
            };
        }
    }, [progress, showQuetions]);

    function handleOnClickOption(value, id) {
        setAnswers({ ...answers, [id]: value })
    }
    function handleOnClickLevel(e) {
        setLevel(e.target.value)
    }
    function handleOnClickSubmit() {
        if (index == data[level].length - 1) {
            setShowReport(true)
            setShowQuetions(false)
            clearTimeout(timeoutId)
        } else {
            setIndex(index + 1)
            clearTimeout(timeoutId)
        }
    }

    useEffect(() => {
        if (showQuetions) {
            setMyTimeOut()
            setProgress(30)
        }
    }, [index])

    function handleOnClickStart() {
        setShowQuetions(true)
        setMyTimeOut()
    }

    function setMyTimeOut() {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {

            handleOnClickSubmit()
        }, 30000)
    }
    function handleOnClickReset() {
        window.location.reload()
    }

    return (
        <Box className={classes.container}>
            {!showReport && !showQuetions &&
                <Box pt="10px">
                   
                    <Select  variant="outlined" onChange={handleOnClickLevel} value={level}>
                        
                        <option value="easy" >Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </Select>
                    <Box pt="10px" >
                        {!showQuetions && <Button color="primary" variant="contained"  onClick={handleOnClickStart}>start</Button>}
                    </Box>
                    <Box className={classes.instBg} >
                        <h2><u>Instructions</u></h2>
                        
                           <Box display="flex" flexDirection="column" alignItems="start" pl="10px" pb="10px">
                               <span>1.There is 3 levels of the game: Easy, Medium, and Hard from the drop down on this page.</span>
                                <span >2.There will be four options of each questions.</span>
                                <span >3.Only one correct answer is there.</span>
                                <span>4.You will be marked according to the questions.</span>
                                <span>5.There is a timer for each question, answer the questions within the time.</span>
                                <span>6.You cannot go previous or submit from the particular questions. You can go next either selecting or leaving the option blank.</span>
                                <span>7.Report will be provided after last question.</span>
                            </Box> 
                                
                                                        
                        
                    </Box>
                </Box>}
            
            {showQuetions && <Timer value={progress} />}
            {showQuetions &&
                <>
                    <Box pb="10px" >
                        <FormLabel  className={classes.qstnBg} component="legend" >Question {index + 1}: {data[level][index].qns}</FormLabel>
                        <FormControl style={{marginTop:"10px"}} component="fieldset">
                            <FormLabel  component="legend" ><b>Options:</b></FormLabel>
                            <RadioGroup aria-label="options" name="options" value={answers[data[level][index].id]} onClick={(e) => handleOnClickOption(e.target.value, data[level][index].id)} >
                                {data[level][index].options.map(option => <FormControlLabel value={option} control={<Radio />} label={option} />)}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleOnClickSubmit}>{index == data[level].length - 1 ? "Submit" : "Next"}</Button>
                </>
            }
            {showReport && <>
                <div>Dificulty Level: {level}</div>
                <div>Result: <b>{getResult()}</b></div>
            </>}
            {showReport &&
                data[level].map((qns) => (
                    <Box className={answers[qns.id] ? qns.ans== answers[qns.id] ? classes.correctBg : classes.wrongBg : ""} pt="10px" display="flex" flexDirection="column" >
                        <FormLabel style={{fontWeight:500}}  component="legend"><b>Question:</b> {qns.qns}</FormLabel>
                        <br></br>
                        <FormLabel component="legend"><b>Answer:</b> {qns.ans}</FormLabel>
                        <br></br>
                        <FormLabel component="legend"><b>Selected option:</b> {answers[qns.id] ? answers[qns.id] : "No Selection"}</FormLabel>
                        <br></br>
                    </Box>
                ))
            }
            {showReport && <Button variant="contained" color="secondary" onClick={handleOnClickReset}>reset</Button>}
        </Box>
    );
}

export default Quiz;