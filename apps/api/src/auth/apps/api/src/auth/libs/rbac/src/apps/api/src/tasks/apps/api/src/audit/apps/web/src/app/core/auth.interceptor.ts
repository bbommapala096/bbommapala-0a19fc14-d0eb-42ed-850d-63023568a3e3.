@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req, next) {
    const token = localStorage.getItem('token');

    if (!token) return next.handle(req);

    return next.handle(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }
}
