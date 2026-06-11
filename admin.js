const demoUsers=[{name:'Sreejith',email:'sreejith@gmail.com',role:'Admin'},{name:'Student',email:'student@gmail.com',role:'User'}];
function loadUsers(){
 const body=document.getElementById('usersBody'); if(!body)return;
 demoUsers.forEach(u=>body.innerHTML+=`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`);
}
loadUsers();
