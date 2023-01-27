const HomeBtn = `
<a href="./index.html">
<i class="homeBtn icon fa-solid fa-arrow-left"> Home</i>
</a>
`;

const About = `
<div class="_content flex biography">
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
    such as React, Typescript, MongoDB, CSS, SCSS, and HTML. 
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
    ${HomeBtn}
</div>
`;

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('about').innerHTML = About;
});
