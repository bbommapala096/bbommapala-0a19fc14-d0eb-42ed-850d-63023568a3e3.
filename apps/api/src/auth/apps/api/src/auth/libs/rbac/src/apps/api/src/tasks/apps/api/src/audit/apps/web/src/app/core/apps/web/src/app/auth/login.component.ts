login() {
  this.http
    .post<any>('http://localhost:3000/auth/login', {
      email: this.email,
      password: this.password,
    })
    .subscribe((res) => {
      localStorage.setItem('token', res.access_token);
      this.router.navigate(['/tasks']);
    });
}
