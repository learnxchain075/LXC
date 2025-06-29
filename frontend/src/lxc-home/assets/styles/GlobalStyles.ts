import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
/*-- reset style start --*/
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: ${({ theme }) => theme.fonts.dmSans};
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.textColor};
  background-color: ${({ theme }) => theme.colors.whiteColor};
  overflow-x: hidden;
}
.body-container{
  overflow-x: hidden;
}
body::-webkit-scrollbar {
  width: 10px;
}
body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 43px;
}
body::-webkit-scrollbar-thumb {
  background: #D0D2D3;
  border-radius: 43px;
}

.dm-sans {
  font-family: ${({ theme }) => theme.fonts.dmSans} !important;
}

.plus-jakarta-sans {
  font-family: ${({ theme }) => theme.fonts.PlusJakartaSans} !important;
}

.caveat {
  font-family: ${({ theme }) => theme.fonts.caveat} !important;
}

.quantico {
  font-family: ${({ theme }) => theme.fonts.quantico} !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
  font-weight: 800;
  letter-spacing: 0;
  color: ${({ theme }) => theme.colors.title};
  line-height: 1.46;
}

h1 {
  font-size: 60px;
}

h2 {
  font-size: 48px;
}

h3 {
  font-size: 30px;
}

h4 {
  font-size: 24px;
}

h5 {
  font-size: 18px;
  font-weight: 500;
}

h6 {
  font-size: 15px;
  font-weight: 500;
}

.wt-400 {
  font-weight: 400 !important;
}

.wt-500 {
  font-weight: 500 !important;
}

.wt-600 {
  font-weight: 600 !important;
}

.wt-700 {
  font-weight: 700 !important;
}

.mb-40 {
  margin-bottom: 40px;
}

.ml-12 {
  margin-left: 12px;
}

.mx-auto {
  margin: 0px auto;
}

.p-0 {
  padding: 0px !important;
}

.m-0 {
  margin: 0px !important;
}

.uppercase {
  text-transform: uppercase !important;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-start {
  justify-content: flex-start;
}

.justify-between {
  justify-content: space-between;
}

.justify-end {
  justify-content: flex-end;
}

.no-border {
  border: none !important;
}

*:focus {
  outline: none;
}

img {
  max-width: 100%;
}

.bg-gray {
  background: ${({ theme }) => theme.colors.bodyBG2};
}

body .mt--60 {
  margin-top: -60px;
}

.xl-mb-10 {
  margin-bottom: 10px;
}

.xl-mb-20 {
  margin-bottom: 20px;
}

.xl-mb-25 {
  margin-bottom: 25px;
}

.xl-mb-30 {
  margin-bottom: 30px !important;
}

.xl-mb-40 {
  margin-bottom: 40px !important;
}

.xl-pl-0 {
  padding-left: 0;
}

.max-w-100 {
  max-width: 100% !important;
}

::-moz-selection {
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.whiteColor};
}

::selection {
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.whiteColor};
}

.row-gap50 {
  row-gap: 50px;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.offer-text {
  margin-top: 28px;
  font-family: ${({ theme }) => theme.fonts.dmSans};
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.colors.iconColor2};
}

.title{
    line-height: 135% !important;
}

.pr-0{
    padding-right: 0px !important;
}

.bg-none {
  background: transparent !important;
}

a,
.btn,
button {
  text-decoration: none !important;
  color: inherit;
  cursor: pointer;
}
a:hover,
.btn:hover,
button:hover {
  text-decoration: none;
  color: inherit;
}
a:focus,
.btn:focus,
button:focus {
  text-decoration: none;
  color: inherit;
  outline: none;
  border: none;
}

button,
input[type=submit] {
  cursor: pointer;
}

button {
  border-radius: 0;
  border: 0;
  background-color: transparent;
}

.btn {
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
}

.vbox-overlay {
  z-index: 99999999;
}

.fadeIn{
  opacity: 1;
  animation: fadeInAnimetion 0.6s linear;
  &s1{
    animation: fadeInAnimetion 1s linear;
  }
}
@keyframes fadeInAnimetion {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(0.99998);
  }
}

/*-- custom bootstrap style start --*/
@media (min-width: 1400px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm,
  .container-xl,
  .container-xxl {
    max-width: 1210px !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  .custom-container {
    max-width: 1370px !important;
    margin: auto;
  }
  .marketplace-container {
    max-width: 1411px !important;
    margin: auto;
  }
}
/*-- custom bootstrap style end --*/
/*-- color style --*/
.color-template {
  color: ${({ theme }) => theme.colors.primary} !important;
}

/*-- bg color style start --*/
.bg-primay {
  background-color: ${({ theme }) => theme.colors.primary};
}

.white-color {
  color: ${({ theme }) => theme.colors.whiteColor};
}

.body-color {
  color: ${({ theme }) => theme.colors.textColor};
}

.bg-aero-blue {
  background-color: ${({ theme }) => theme.colors.aeroBlue};
}

.green-color {
  color: ${({ theme }) => theme.colors.primary6Deep};
}

.check-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.max-width-570 {
  max-width: 570px;
}

.z-index-3 {
  position: relative;
  z-index: 3 !important;
}

/*-- bg color style end --*/
/*-- Lib custom Start --*/
.row {
  margin: 0px -15px !important;
}

.col-xxl-1,
.col-xxl-2,
.col-xxl-3,
.col-xxl-4,
.col-xxl-5,
.col-xxl-6,
.col-xxl-7,
.col-xxl-8,
.col-xxl-9,
.col-xxl-10,
.col-xxl-11,
.col-xxl-12,
.col-xl-1,
.col-xl-2,
.col-xl-3,
.col-xl-4,
.col-xl-5,
.col-xl-6,
.col-xl-7,
.col-xl-8,
.col-xl-9,
.col-xl-10,
.col-xl-11,
.col-xl-12,
.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-1,
.col-2,
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8,
.col-9,
.col-10,
.col-11,
.col-12 {
  padding: 0px 15px !important;
}

/*-- Lib custom End --*/
/*-- Dark Mood --*/
body.dark-scheme,
html.dark-scheme body {
  color: ${({ theme }) => theme.colors.iconColor};
}
body.dark-scheme h1,
body.dark-scheme h2,
body.dark-scheme h3,
body.dark-scheme h4,
body.dark-scheme h5,
body.dark-scheme h6,
html.dark-scheme body h1,
html.dark-scheme body h2,
html.dark-scheme body h3,
html.dark-scheme body h4,
html.dark-scheme body h5,
html.dark-scheme body h6 {
  color: ${({ theme }) => theme.colors.whiteColor};
}

/*-- reset style end --*/
.CircularProgressbar .CircularProgressbar-text{
  color: ${({ theme }) => theme.colors.title};
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  letter-spacing: 0.24px;
  text-transform: uppercase;
}

.skills-content{
    .CircularProgressbar .CircularProgressbar-trail {
      stroke: ${({ theme }) => theme.colors.whiteColor} !important;
  }
}
.CircularProgressbar .CircularProgressbar-text{
  fill: ${({ theme }) => theme.colors.title} !important;
}
.progress.pie_progress{
  position: relative;
  p{
    position: absolute;
    bottom: 5px;
    width: 100%;
    text-align: center;
  }
}

.rotate-icon-btn {
  transition: 0.3s;
  position: relative;
  width: -moz-fit-content;
  width: fit-content;
}
.rotate-icon-btn .rotate-icon {
  transition: 0.3s;
  position: relative;
  z-index: 1;
}
.rotate-icon-btn .icon {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rotate-icon {
  transition: 0.3s;
}
.LearnXChain-overly-bg {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: ${({ theme }) => theme.colors.blackColor}80;
	z-index: 999;
	opacity: 0;
	visibility: hidden;
	transition: all 0.3s ease-in;
  }
  

/*--------------------------------
05. Utilities style
--------------------------------*/
.wt-500{
  font-weight: 500 !important;
}
.wt-600{
  font-weight: 600 !important;
}
.wt-700{
  font-weight: 700 !important;
}
.wt-800{
  font-weight: 800 !important;
}
/*-- margin style --*/
.mb-20 {
  margin-bottom: 20px;
}

.mb-30 {
  margin-bottom: 30px;
}

//headline animated css


.cd-words-wrapper {
    display: inline-block;
    position: relative;
    text-align: left;
  }
  .cd-words-wrapper b {
    display: inline-block;
    position: absolute;
    white-space: nowrap;
    left: 0;
    top: 0;
  }
  .cd-words-wrapper b.is-visible {
    position: relative;
  }

  .cd-headline.clip b{
    position: relative;
  }

  .cd-headline.slide .cd-words-wrapper {
    overflow: hidden;
    vertical-align: top;
  }
  .cd-headline.slide b {
    opacity: 0;
    top: 0.2em;
  }

  .cd-headline.slide b.is-visible {
    top: 0;
    opacity: 1;
    animation: slide-in 0.6s;
  }
  .cd-headline.slide b.is-hidden {
    animation: slide-out 0.6s;
  }

  @keyframes slide-in {
    0% {
      opacity: 0;
      transform: translateY(-100%);
    }
    60% {
      opacity: 1;
      transform: translateY(20%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-out {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    60% {
      opacity: 0;
      transform: translateY(120%);
    }
    100% {
      opacity: 0;
      transform: translateY(100%);
    }
  }

  .cd-headline.loading-bar span {
    display: inline-block;
    padding: 0.2em 0;
}
.cd-headline.loading-bar .cd-words-wrapper {
    overflow: hidden;
    vertical-align: top;
}
.cd-headline.loading-bar .cd-words-wrapper::after {
    /* loading bar */
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 0;
    background: #0096a7;
    z-index: 2;
    transition: width 0.3s -0.1s;
}
.cd-headline.loading-bar .cd-words-wrapper.is-loading::after {
    width: 100%;
    transition: width 3s;
}
.cd-headline.loading-bar b {
    top: 0.2em;
    opacity: 0;
    transition: opacity 0.3s;

    &::after{
      position: absolute;
      content: "";
      bottom: 0;
      left: 0;
      height: 8px;
      background: ${({ theme }) => theme.colors.primary6};
    }
}

.cd-headline.loading-bar b.is-visible {
    opacity: 1;
    top: 0;

    &::after{
      width: 100%;
      animation: lineAnimate 3s ease-in-out;
    }
}

@keyframes lineAnimate {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

//splitting css
.splitting {
    //  color: saturate(lighten(#182952,55%),60%);
    .char {
      transition: transform 0.5s cubic-bezier(0.3, 0, 0.3, 1),
        opacity 0.5s linear;
      transition-delay: calc(30ms * var(--char-index));
    }

    &[data-scroll="out"] .char {
      opacity: 0.1;
      transform: translateY(0.25em);
    }
  }
  .splitting-mark {
    display: none;
  }

  /* ---------------------------------- */
  /* Recommended styles for Splitting */
  .splitting .word,
  .splitting .char {
    display: inline-block;
  }

  /* Psuedo-element chars */
  .splitting .char {
    position: relative;
  }

  .splitting .char::before,
  .splitting .char::after {
    content: attr(data-char);
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    transition: inherit;
    user-select: none;
  }

  /* Expanded CSS Variables */

  .splitting {
    /* The center word index */
    --word-center: calc((var(--word-total) - 1) / 2);

    /* The center character index */
    --char-center: calc((var(--char-total) - 1) / 2);

    /* The center character index */
    --line-center: calc((var(--line-total) - 1) / 2);
  }

  .splitting .word {
    /* Pecent (0-1) of the word's position */
    --word-percent: calc(var(--word-index) / var(--word-total));

    /* Pecent (0-1) of the line's position */
    --line-percent: calc(var(--line-index) / var(--line-total));
  }

  .splitting .char {
    /* Percent (0-1) of the char's position */
    --char-percent: calc(var(--char-index) / var(--char-total));

    /* Offset from center, positive & negative */
    --char-offset: calc(var(--char-index) - var(--char-center));

    /* Absolute distance from center, only positive */
    --distance: calc(
      (var(--char-offset) * var(--char-offset)) / var(--char-center)
    );

    /* Distance from center where -1 is the far left, 0 is center, 1 is far right */
    --distance-sine: calc(var(--char-offset) / var(--char-center));

    /* Distance from center where 1 is far left/far right, 0 is center */
    --distance-percent: calc((var(--distance) / var(--char-center)));
  }

  @media (max-width: 768px){
    body{
      font-size: 15px;
    }
    h2{
      font-size: 36px;
    }
    .btn-inner{
      min-width: max-content !important;
    }
    .btn-olive-deep{
      max-width: 180px;
    }
  }

`;

export default GlobalStyles;
