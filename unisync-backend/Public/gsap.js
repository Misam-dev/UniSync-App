const sp1 = document.querySelector("#sp1");

const roles = ["Admin", "Student", "Society"];

let tl = gsap.timeline({ repeat: -1 }); // infinite loop

roles.forEach(role => {

    tl.to(sp1, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => {
            sp1.textContent = role;
        }
    });

    tl.fromTo(
        sp1,
        { opacity: 0, y: -10 },
        {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power1.out",
        }
    );

    // wait before switching to next
    tl.to({}, { duration: 2 });  
});
