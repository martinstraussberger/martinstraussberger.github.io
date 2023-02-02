const HomeBtn = `
<a href="./index.html">
<i class="homeBtn icon fa-solid fa-arrow-left"> Home</i>
</a>
`;

const PersonalDevelopment = `
<h1>Shot of Awe how I approach my Goals</h1>
<p>
  As a fan of personal development, I firmly believe investing a couple of hours into ourselves is crucial. 
  After all, it's time to take control of our lives and not let our inner temptations play the game for us. 
  That's why I've created a Timeboxing Model that's free, accessible, and built with HTML and CSS, 
  so you too can harness the power of time management. They say time is money, but I say it's worth even more. 
  Every hour that passes without valuing it is a lost opportunity. An hour lost is not just a missed opportunity 
  but a depletion of the precious and limited time we have on this unique planet. So, let's make the most of every minute 
  with the help of the Timeboxing concept. 

  </br>

  I can personally attest to its effectiveness and its positive impact on my daily goals and life aspirations. 
  For example, building this website and rescuing a lost puppy from Morocco were two monumental tasks while working full-time. 
  We fought and organized for five months to bring him to Germany, undergo the blood test procedures, and satisfy all government requirements. 
  So why not give it a shot? 🚀 
  
  </br>

  The first challenge is sticking to it, but trust me, it's worth it. After all, the only thing standing between you 
  and your dreams is the time you choose to invest in yourself." 🙃
  </br>

  <h4>In short, what is Timeboxing?</h4>
  <p>
    Timeboxing is a time management technique where a specific amount of time is allocated for a task or activity. The goal is to increase focus and productivity. 
    A Timeboxing Model involves setting clear, achievable goals for each cluster and sticking to the designated time frame. A cluster is called Timeslot. 
    It helps to prioritize tasks and manage time more effectively, reducing the risk of procrastination and distractions. Additionally, regularly reviewing and 
    adjusting the time allocations can lead to continuous improvement and optimization of the model and your mindset.
  </p>
</p>
`;

const PreviewTimeBoxing = `
<div class="flex">
<h4>Preview</h4>
  <a>
    <img src="../public/images/PreviewTimeBoxing.jpg" width="290px" height="490px"
  </a>  
  <a target="_blank" href="./public/pdf/timeBoxingTemplate.pdf"><b>PDF</b></a>
</div>
`

const About = ` 
<div class="_content flex biography">
    <h2>Bio</h2>
    <div class="bio-intro">
    <p>
      Martin Straussberger | B. Eng
    </br>
      Web-Developer with deep focus on Frontend Engineering
    </p>
    </div>
    <p class="p-biography">
    My journey in Frontend Engineering began during my studies in Mechanical
    Engineering when I discovered my passion for Software Engineering in my second and
    third semesters through a course on Computer Science for Mechanical Engineers. The
    first project I worked on, an "Automated Ant Game," sparked my interest in Web
    Development. 
    To further develop my skills, I took several online courses on Udemy,
    and upon completing my studies, I enrolled in Software Engineering at the Code
    University of Applied Sciences. 
    </br>
    </br>
    The program's hands-on approach, working with
    corporate partners and completing 15-week projects per semester, deepened my
    knowledge and expertise, particularly in Frontend Engineering using technologies
    such as React, Typescript, MongoDB, Node.js, CSS, SCSS, and HTML. 
    </br>
    </br>
    Over the past two years,
    I have put my skills into practice by working for a company called ehealth-tec
    GmbH. I have had the opportunity to learn from my teammates and participate in
    advanced training in Frontend Engineering, including setting up a Cypress E2E
    Docker environment for our software and implementing over 100 E2E tests. In
    partnership with the Business Owner, Product Owner, and our customers, I planned
    and implemented a new Design System using Figma also a Micro-Frontend Architecture
    for our new application written in React, D3.js, Jest, Typescript, and
    API-Platform to communicate with the Backend. 
    </br>
    </br>
    With the help of our R&D process with our customers, we
    were able to develop a fully functional application with real-time interactive and
    dynamic charts. With over four years of practical experience, I am eager to apply
    my skills to your business, accelerating the research and development process from
    scratch to a fully functional Application, beyond just an MVP.
    </p>
    ${PersonalDevelopment}
    ${PreviewTimeBoxing}
    </br>
    ${HomeBtn}
</div>
`;

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('about').innerHTML = About;
});
