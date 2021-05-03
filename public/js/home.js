async function modalUserInfo(token){
  let user = await fetch(
   "https://users-dasw.herokuapp.com/api/users/" + email,
   {
     method: "GET",
     headers: {
       "x-admin": sessionStorage.token,
       "x-auth": sessionStorage.token,
     },
   }
 );
 }