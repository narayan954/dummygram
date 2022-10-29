const options = {
  bottom: "32px", // default: '32px'
  right: "32px", // default: '32px'
  left: "unset", // default: 'unset'
  time: "0.3s", // default: '0.3s'
  mixColor: "#fff", // default: '#fff'
  backgroundColor: "#fff", // default: '#fff'
  buttonColorDark: "#100f2c", // default: '#100f2c'
  buttonColorLight: "#fff", // default: '#fff'
  saveInCookies: true, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: false // default: true
}

const darkmode = new Darkmode(options);
darkmode.showWidget();

document.getElementById('scrollbar_style').innerHTML = 'body::-webkit-scrollbar { width: 10px; } /* Track */ body::-webkit-scrollbar-track { background: white; } /* Handle */ body::-webkit-scrollbar-thumb { background: linear-gradient( 45deg, #405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d ); border-radius: 10px; }';

document.querySelector("button.darkmode-toggle").addEventListener("click", function() {
  if (document.body.classList.contains('darkmode--activated'))
  {
    document.getElementById('scrollbar_style').innerHTML = 'body::-webkit-scrollbar { width: 10px; } /* Track */ body::-webkit-scrollbar-track { background: black; } /* Handle */ body::-webkit-scrollbar-thumb { background: linear-gradient( 45deg, #f4f80c, #addb51, #a2b43a, #51c135, #5ce130, #1dfddf ); border-radius: 10px; }';
  }
  else
  {
    document.getElementById('scrollbar_style').innerHTML = 'body::-webkit-scrollbar { width: 10px; } /* Track */ body::-webkit-scrollbar-track { background: white; } /* Handle */ body::-webkit-scrollbar-thumb { background: linear-gradient( 45deg, #405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d ); border-radius: 10px; }';
  }
});