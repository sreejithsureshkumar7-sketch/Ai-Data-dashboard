function registerUser(){
  const name=document.getElementById('name').value;
  const email=document.getElementById('email').value;
  const pass=document.getElementById('password').value;
  if(!name||!email||!pass){alert('All fields required');return}
  localStorage.setItem('user',JSON.stringify({name,email,role:'user'}));
  alert('Registered successfully'); location.href='login.html';
}
function loginUser(){
  const email=document.getElementById('email').value;
  if(!email){alert('Enter email');return}
  localStorage.setItem('loggedIn','true');
  alert('Login success'); location.href='index.html';
}
function loadProfile(){
  const user=JSON.parse(localStorage.getItem('user')||'{"name":"Student User","email":"demo@gmail.com","role":"user"}');
  document.getElementById('pname').textContent=user.name;
  document.getElementById('pemail').textContent=user.email;
  document.getElementById('prole').textContent=user.role;
}
