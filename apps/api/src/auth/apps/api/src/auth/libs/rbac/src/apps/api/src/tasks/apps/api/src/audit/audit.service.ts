@Injectable()
export class AuditService {
  async log(userId: string, action: string, resource: string) {
    console.log(
      `[AUDIT] user=${userId} action=${action} resource=${resource}`
    );
  }
}
