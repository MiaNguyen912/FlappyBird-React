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
const OBSTACLE_WIDTH = 100;
const OBSTACLE_GAP = 200;

const App = () => {
    const [birdHeight, setBirdHeight] = useState(250); //position of top of bird
    const [isStarted, setStart] = useState(false);
    const [upperObstacleHeight, setUpperObstacleHeight] = useState(200);
    const [obstacleLeft, setObstacleLeft] = useState(window.innerWidth - OBSTACLE_WIDTH)
    const [score, setScore] = useState(0)

    let bottomObstacleHeight = GAME_SIZE-GROUND_HEIGHT-OBSTACLE_GAP-upperObstacleHeight;


    useEffect(()=>{  //bird fall automatially
        let timeId;
        if(isStarted && birdHeight< GAME_SIZE - GROUND_HEIGHT - BIRD_SIZE){ //if not touch the ground
            timeId = setInterval(()=>{
                setBirdHeight(prevHeight => prevHeight + GRAVITY) //decrease height of bird
            },25)
            return ()=>{
                clearInterval(timeId);
            }
        }
        
    }, [isStarted, birdHeight] )

    useEffect(()=>{  //obstacle move automatically
        let obstacleId;
        if(isStarted){
            if (obstacleLeft >= -OBSTACLE_WIDTH){
                obstacleId = setInterval(()=>{
                    setObstacleLeft(obstacleLeft=> obstacleLeft-5)
                },10)
                return ()=>{
                    clearInterval(obstacleId)
                }
            }
            else {
                setObstacleLeft(window.innerWidth - OBSTACLE_WIDTH)
                setUpperObstacleHeight(Math.floor(Math.random() * (GAME_SIZE - OBSTACLE_GAP)));
                setScore(score => score + 1)
            }
        }
        else {
            setObstacleLeft(window.innerWidth - OBSTACLE_WIDTH)
                setUpperObstacleHeight(Math.floor(Math.random() * (GAME_SIZE - OBSTACLE_GAP)));
        }
    }, [isStarted, obstacleLeft])

    useEffect(()=>{  //catch collision automatically
        const touchGround = birdHeight >= (GAME_SIZE - GROUND_HEIGHT - BIRD_SIZE)
        const touchTop = birdHeight >= 0 && birdHeight <= upperObstacleHeight;
        const touchBottom = birdHeight <= (GAME_SIZE - GROUND_HEIGHT) && birdHeight >= (GAME_SIZE - GROUND_HEIGHT - bottomObstacleHeight);
        if (obstacleLeft <= (BIRD_SIZE*2)){ //bird width = BIRD_SIZE*2
            if (touchGround || touchTop || touchBottom){
                setStart(false)
                alert("Score: " + score)
                setScore(0)
            }

        }
    }, [birdHeight, upperObstacleHeight, bottomObstacleHeight, obstacleLeft])

    
    function handleJump(){
        let newHeight = birdHeight-JUMP_HEIGHT;
        if (!isStarted) setStart(true)
        else if (newHeight < 0) setBirdHeight(0);
        else setBirdHeight(newHeight);
    }

    return (
        <Div onKeyDown={handleJump} tabIndex={0}>
            <span style={{color: "white", position: "absolute", fontSize: "24px", top: "10px"}}>{score}</span>

            <GameBox size={GAME_SIZE}>
                <Obstacle 
                    top={0}
                    width={OBSTACLE_WIDTH}
                    height={upperObstacleHeight}
                    left={obstacleLeft}
                    flip={true}
                />
                <Obstacle 
                    top={GAME_SIZE  - upperObstacleHeight - GROUND_HEIGHT - bottomObstacleHeight}
                    width={OBSTACLE_WIDTH}
                    height={bottomObstacleHeight + 10}
                    left={obstacleLeft}
                    flip={false}
                />
                <Bird 
                    size={BIRD_SIZE} 
                    src={bird_img}
                    top={birdHeight}
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
`
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`

const GameBox = styled.div`
    height: ${(props)=>props.size}px;
    width: 100%;
    background-image: url(${background_img});
    background-repeat: repeat-x; //only repreat horizontally
    overflow: hidden
`

const Obstacle = styled.div`
    position: relative;
    top: ${props => props.top}px;
    background-image: url(${pipe_img});
    // max-width: 100%;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    left: ${props => props.left}px;
    transform: rotate(${props => props.flip && 180}deg)
`
