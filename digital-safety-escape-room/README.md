# 🛡️ Digital Safety Escape Room

## Project Structure and Render Deployment

The project has two application folders:

```text
digital-safety-escape-room/
├── frontend/
└── backend/
```

Deploy them as two separate Render services.

### Frontend Static Site

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-BACKEND-SERVICE.onrender.com/api`

### Backend Web Service

- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment variables: copy the values from `backend/.env.example`

The backend build creates `backend/dist/server.cjs`. Do not use
`node dist/server.cjs` from the repository root; Render must use `backend`
as the service root.

**Team 18**

A short, interactive cybersecurity awareness game that teaches users to
recognize common digital threats by making safer decisions.

## 📌 Project Overview

Digital Safety Escape Room is a gamified cybersecurity learning
application. Instead of learning cyber safety only through text or
lectures, players learn by solving short, realistic digital-safety
challenges.

The game focuses on four common threats:

-   🎣 Phishing
-   🔑 Weak / Unsafe Passwords
-   📱 Fake or Malicious QR Codes
-   💬 Scam Messages

The main idea is simple:

**Observe → Analyze → Decide → Get Feedback → Learn → Progress**

## 🎯 Objectives

-   Teach basic cybersecurity concepts in an engaging way.
-   Help users recognize common online scams and unsafe digital
    behavior.
-   Provide immediate feedback after every decision.
-   Make learning game-like using points, lives, and progress.
-   Give the player a final cybersecurity score and badge.

## 👥 Target Users

-   Students
-   Beginners
-   General digital users
-   Anyone who wants to improve basic cyber-safety awareness

## 🎮 How the Game Works

1.  Open the application.
2.  Read the welcome screen and instructions.
3.  Start the game.
4.  Complete four cybersecurity challenges.
5.  Choose the safest answer for each scenario.
6.  Get instant feedback and an explanation.
7.  Earn points for correct answers.
8.  Lose one life for an incorrect answer.
9.  Track progress through the challenges.
10. Complete all challenges to receive a final score and badge.

## 🧩 Four Challenges

### 1. 🎣 Phishing Challenge

The player examines a realistic email, notification, or online message
and decides whether it is genuine or phishing.

Players learn to notice:

-   Suspicious links
-   Urgent language
-   Unknown senders
-   Requests for sensitive information

### 2. 🔑 Password Challenge

The player chooses the strongest password from multiple options.

Players learn about:

-   Password length
-   Unique passwords
-   Avoiding predictable information
-   Avoiding weak or easily guessed passwords

### 3. 📱 Fake QR Challenge

The player examines a QR-code scenario and decides whether it is safe or
suspicious.

Players learn to:

-   Be careful with unknown QR codes
-   Check the destination before continuing
-   Avoid unexpected QR-code requests

### 4. 💬 Scam Message Challenge

The player examines an SMS or messaging-app scenario and identifies scam
indicators.

Players learn to recognize:

-   Fake prize claims
-   Urgent requests
-   Suspicious links
-   Payment requests
-   Requests for confidential information

## ❤️ Game Mechanics

### Points

Correct answers increase the player's score.

### Lives

The player starts with lives. An incorrect answer removes one life.

### Progress

A progress indicator shows the current challenge and overall progress.

### Instant Explanation

After every answer, the game explains why the decision was safe or
unsafe.

### Game Over

If all lives are lost, the player can restart the game.

## 🏆 Final Score & Badge

After completing all four challenges, the game calculates a
cybersecurity awareness score.

  -----------------------------------------------------------------------
  Score                   Badge                   Meaning
  ----------------------- ----------------------- -----------------------
  0--40%                  🌱 Cyber Beginner       Needs more practice
                                                  with basic cyber safety

  41--75%                 🛡️ Cyber Smart          Understands most common
                                                  digital safety risks

  76--100%                🏆 Cyber Safety Expert  Shows strong awareness
                                                  of common cyber threats
  -----------------------------------------------------------------------

## 🗺️ User Flow

``` text
START
  ↓
Welcome Screen
  ↓
Instructions
  ↓
Start Game
  ↓
Phishing Challenge
  ↓
Check Answer → Score/Lives → Explanation
  ↓
Password Challenge
  ↓
Check Answer → Score/Lives → Explanation
  ↓
Fake QR Challenge
  ↓
Check Answer → Score/Lives → Explanation
  ↓
Scam Message Challenge
  ↓
Check Answer → Score/Lives → Explanation
  ↓
Final Cybersecurity Score
  ↓
Badge
  ↓
ESCAPE!
  ↓
Play Again / Exit
```

## 💡 Why This Project?

Many people know that cyber threats exist but may still miss warning
signs before clicking a link, sharing information, or taking an unsafe
action.

Digital Safety Escape Room addresses this gap by allowing users to
**practice making digital-safety decisions** rather than only reading
about cybersecurity.

## 🌍 Expected Impact

The project aims to help users:

**Recognize → Think → Verify → Act Safely**

The goal is to make cybersecurity awareness practical, engaging, and
memorable.

## 🚀 Future Scope

Possible future improvements include:

-   AI-generated cybersecurity scenarios
-   Personalized and adaptive difficulty
-   Institution-level dashboards
-   Leaderboards and competitions
-   Additional game levels
-   Multiplayer mode
-   Regularly updated scam scenarios

## 👨‍💻 Team 18

  Roll Number   Team Member
  ------------- --------------------------
  24EG107C52    Soujith Goudampally
  24EG105D01    Adama Hansini
  25EG505E03    Vydyula Nigama
  24EG112D44    Dubbaka Mrudhula
  24EG105K52    Thavidaboina Bhavya Sree

------------------------------------------------------------------------

> **Don't just learn about cyber threats. Learn to recognize them when
> they happen.**

**PLAY SMART • STAY SAFE • ESCAPE SECURELY**
