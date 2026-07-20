tsParticles.load({
  id: "particles-js",
  options: {
    background: {
      color: {
        value: "transparent"
      }
    },

    fpsLimit: 60,

    particles: {
      number: {
        value: 70
      },

      color: {
        value: ["#00D4FF", "#00FF88", "#7C3AED"]
      },

      shape: {
        type: "circle"
      },

      opacity: {
        value: 0.5
      },

      size: {
        value: {
          min: 2,
          max: 5
        }
      },

      links: {
        enable: true,
        distance: 150,
        color: "#00D4FF",
        opacity: 0.2,
        width: 1
      },

      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "bounce"
        }
      }
    },

    interactivity: {

      events: {

        onHover: {

          enable: true,

          mode: "repulse"

        },

        resize: true

      },

      modes: {

        repulse: {

          distance: 120

        }

      }

    },

    detectRetina: true
  }
});