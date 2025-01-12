import React, { StrictMode, useEffect, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecordingToggle />
  </StrictMode>
);

function RecordingToggle() {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const timeMax = 60;
  const [timeStopped, setTimeStopped] = useState(0);
  const circumference = recording ? 40.84 : 50.27;
  const circumferencePart = recording ? 1 - (time / timeMax) : 1;
  const strokeDashArray = `${circumference} ${circumference}`;
  const strokeDashOffset = +(circumference * circumferencePart).toFixed(2);

  function timeFormatted() {
    const timeToDisplay = recording ? time : timeStopped;
    const minutes = `0${Math.floor(timeToDisplay / 60)}`.slice(-2);
    const seconds = `0${timeToDisplay % 60}`.slice(-2);
    return `${minutes}:${seconds}`;
  }

  useEffect(() => {
    let frameId = 0;

    if (recording) {
      setTimeStopped(0);
      const render = () => {
        setTime((time) => time + 1);
        setTimeStopped((time) => time + 1);
        frameId = setTimeout(render, 1e3);
      };
      frameId = setTimeout(render, 1e3);
    } else {
      setTime(0);
      clearTimeout(frameId);
    }
    return () => {
      clearTimeout(frameId);
    };
  }, [recording]);

  useEffect(() => {
    if (time >= timeMax) {
      setRecording(false);
    }
  }, [time]);

  return (
    <button
      className="recorder"
      type="button"
      aria-pressed={recording}
      onClick={() => setRecording(!recording)}
    >
      <span className="recorder__label-start" aria-hidden={recording}>Stop</span>
      <span className="recorder__switch">
        <span className="recorder__switch-handle">
          <svg className="recorder__timer" viewBox="0 0 16 16" width="16px" height="16px" aria-hidden="true">
            <g fill="none" strokeLinecap="round" strokeWidth="0" transform="rotate(-90,8,8)">
              <circle className="recorder__timer-ring" stroke="hsla(0,0%,100%,0.3)" cx="8" cy="8" r="8" />
              <circle className="recorder__timer-ring" stroke="hsla(0,0%,100%,0.5)" cx="8" cy="8" r="8" strokeDasharray={strokeDashArray} strokeDashoffset={strokeDashOffset} />
            </g>
          </svg>
        </span>
      </span>
      <span className="recorder__label-end" aria-hidden={!recording}>
        <span className="recorder__label-end-text">Record</span>
        <span className="recorder__label-end-text">{timeFormatted()}</span>
      </span>
    </button>
  );
}

document.getElementById("questionnaire").addEventListener("submit", function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  let score = 0;

  formData.getAll("personality").forEach(value => {
    score += 1;
  });

  const type = formData.get("type");
  if (type === "чьмо") {
    score -= 1;
  } else {
    score += 1;
  }

  const speed = document.querySelector('input[name="speed"]').value;
  score += parseInt(speed, 10);

  displayResult(score);
});

function displayResult(score) {
  const resultImage = document.getElementById("result-image");
  const resultDescription = document.getElementById("result-description");

  if (score <= 5) {
    resultImage.src = "https://i.redd.it/i-keep-seeing-this-angry-cat-meme-does-anyone-know-what-v0-0o96ygkg9jw91.jpg";
    resultDescription.textContent = "You are an angry cat!";
  } else if (score <= 10) {
    resultImage.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdBWB76EZKUgHdARYa-XNyIzoiJiUiyKiFrg&s";
    resultDescription.textContent = "You are a curious cat!";
  } else {
    resultImage.src = "https://static.displate.com/857x1200/displate/2023-02-01/98e24af569e8f8dfb4391dbac0accb10_9edaab163f5e46e04be6a7ecb1dda7ae.jpg";
    resultDescription.textContent = "You are a majestic cat!";
  }
}

function init() {
  const wrapper = document.querySelector('.wrapper');
  const wheel = document.querySelector('.wheel');
  const defaultHamsterEnergy = 1000;
  const hamster = {
    energy: defaultHamsterEnergy,
    speedFactor: 4,
    isRunning: true,
  };

  const setSpeed = () => {
    wrapper.style.setProperty('--hamster-speed', `${1 / hamster.speedFactor}s`);
    wrapper.style.setProperty('--wheel-speed', `${2 / hamster.speedFactor}s`);
    wrapper.style.setProperty('--wheel-angle', `${0.4 * hamster.speedFactor}deg`);
  };

  document.querySelector('input').addEventListener('input', e => {
    hamster.speedFactor = e.target.value;
    setSpeed();
  });

  setInterval(() => {
    if (hamster.isRunning) {
      hamster.energy -= (hamster.speedFactor * hamster.speedFactor);
    }
    if (hamster.isRunning && hamster.energy < 0) {
      hamster.isRunning = false;
      wheel.classList.add('spinning');
      setTimeout(() => {
        hamster.energy = defaultHamsterEnergy;
        hamster.isRunning = true;
        wheel.classList.remove('spinning');
      }, 6 * 1000);
    }
  }, 500);

  setSpeed();
}

window.addEventListener('DOMContentLoaded', init);
