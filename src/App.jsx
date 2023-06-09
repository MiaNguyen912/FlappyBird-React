import React, { useEffect, useState } from 'react'
import styled from 'styled-components'; //https://styled-components.com/docs/basics#installation
import bird_img from "./images/bird_static.png"
import background_img from "./images/sky.png"
import pipe_img from "./images/pipe.png"

const BIRD_SIZE = 40;
const GAME_SIZE = 600;
const GROUND_HEIGHT = 80;
const GRAVITY = 6;
const JUMP_HEIGHT = 75;
const OBSTACLE_WIDTH = 246;
const OBSTACLE_GAP = 200;

const App = () => {
    const [birdHeight, setBirdHeight] = useState(350); //position of top of bird
    const [isStarted, setStart] = useState(false);
    const [upperObstacleHeight, setUpperObstacleHeight] = useState(400);
    const [obstacleLeft, setObstacleLeft] = useState(window.innerWidth - OBSTACLE_WIDTH)
    const [score, setScore] = useState(0)
    const [headUp, setHeadUp] = useState(false)

    let bottomObstacleHeight = (upperObstacleHeight-OBSTACLE_GAP);
    //----------------------------

    useEffect(()=>{  //bird fall automatially
        let timeId;
        if(isStarted && birdHeight >  (GROUND_HEIGHT + BIRD_SIZE)){ //if not touch the ground
            timeId = setInterval(()=>{
                setBirdHeight(prevHeight => prevHeight - GRAVITY) //decrease height of bird
            },25)
            return ()=>{
                clearInterval(timeId);
            }
        }
        
    }, [isStarted, birdHeight] )

    useEffect(()=>{  //obstacle move automatically
        let obstacleId;
        let goLeft;
        if(score <=5) goLeft = 5;
        else if (score <= 10) goLeft = 7.5;
        else goLeft = 10;

        if(isStarted){
            if (obstacleLeft >= -OBSTACLE_WIDTH){ //pipes haven't go out of screen
                obstacleId = setInterval(()=>{
                    setObstacleLeft(obstacleLeft=> obstacleLeft-goLeft)
                },10)
                return ()=>{
                    clearInterval(obstacleId)
                }
            }
            else {
                setObstacleLeft(window.innerWidth)
                setUpperObstacleHeight(GAME_SIZE - Math.floor(Math.random() * (GAME_SIZE - GROUND_HEIGHT - OBSTACLE_GAP))); //Math.random() = 0->0.999
                setScore(score => score + 1)
            }
        }
        else {
            setObstacleLeft(window.innerWidth - OBSTACLE_WIDTH)
            setUpperObstacleHeight(GAME_SIZE - Math.floor(Math.random() * (GAME_SIZE - GROUND_HEIGHT - OBSTACLE_GAP))); //height = GAME_SIZE - length
        }
    }, [isStarted, obstacleLeft, score])

    useEffect(()=>{  //catch collision automatically
        const touchGround = birdHeight <= (GROUND_HEIGHT + BIRD_SIZE)
        const touchTop = birdHeight >= upperObstacleHeight;
        const touchBottom = birdHeight <= (bottomObstacleHeight+BIRD_SIZE);

        if (touchGround ||   (obstacleLeft<=(BIRD_SIZE*2) && (touchTop||touchBottom))){
        //bird width = BIRD_SIZE*2
            if (touchTop){
                setTimeout(()=>{
                    setStart(false)
                    alert("Score: " + score)
                    setScore(0)
                    setBirdHeight(350)
                },50)
            }
            else{
                alert("Score: " + score)
                setStart(false)
                setScore(0)
                setBirdHeight(350)
            }
        }
    }, [birdHeight, bottomObstacleHeight, upperObstacleHeight, obstacleLeft, score])

    // useEffect(()=>{
    //     const touchTop = birdHeight >= upperObstacleHeight;
    //     if (touchTop) setBirdHeight(upperObstacleHeight)
    // }, [birdHeight])
    
    function handleJump(){
        setHeadUp(true);
        setTimeout(()=>{
            setHeadUp(false)
        }, 100)
        let jump; 
        if(score <= 5) jump = JUMP_HEIGHT;
        else if (score <= 10) jump = JUMP_HEIGHT + 5;
        else if (score <= 20) jump = JUMP_HEIGHT + 10;
        else jump = JUMP_HEIGHT + 15;

        let newHeight = birdHeight+jump;
        if (!isStarted) setStart(true)
        else if (newHeight > GAME_SIZE) setBirdHeight(GAME_SIZE);
        else if (obstacleLeft<=(BIRD_SIZE*2) && newHeight >= upperObstacleHeight) setBirdHeight(upperObstacleHeight);
        else setBirdHeight(newHeight);
    }
    //----------------------------

    return (
        <Div onKeyDown={handleJump} tabIndex={0} onTouchStart={handleJump}>
            <span style={{color: "white", position: "absolute", fontSize: "24px", top: "10px"}}>{score}</span>
            <GameBox size={GAME_SIZE}>
                <Obstacle  //top
                    top={0}
                    width={OBSTACLE_WIDTH}
                    length={GAME_SIZE - upperObstacleHeight}
                    left={obstacleLeft}
                    flip={true}
                />
                <Obstacle  //bottom
                    top={GAME_SIZE - bottomObstacleHeight - (GAME_SIZE-upperObstacleHeight)} //length of upper pipe = (GAME_SIZE-upperObstacleHeight)
                    width={OBSTACLE_WIDTH}
                    length={bottomObstacleHeight - GROUND_HEIGHT +10}
                    left={obstacleLeft}
                    flip={false}
                />
                <Bird 
                    size={BIRD_SIZE} 
                    src={bird_img}
                    top={GAME_SIZE-birdHeight}
                    headUp={headUp}
                />
            </GameBox>
        </Div>    
    )
}

export default App;
//----------------------

const Bird = styled.img` //create Bird component that'll render a <img> tag with some styles
    position: absolute;
    src: ${(props)=> props.src});
    height: ${(props)=> props.size}px;
    width: ${(props)=> props.size*2}px;
    top: ${props => props.top}px;
    border-radius: 50%;
    transform: rotate(${props => props.headUp && -25}deg);
`
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`

const GameBox = styled.div`
    height: ${(props)=>props.size}px;
    width: 100%;
    // min-width: ${(props)=>props.size}px;
    background-image: url(${background_img});
    background-repeat: repeat-x; //only repreat horizontally
    overflow: hidden
`

const Obstacle = styled.div`
    position: relative;
    top: ${props => props.top}px;
    background-image: url(${pipe_img});
    width: ${props => props.width}px;
    height: ${props => props.length}px;
    left: ${props => props.left}px;
    transform: rotate(${props => props.flip && 180}deg);
    background-repeat: no-repeat;
`
