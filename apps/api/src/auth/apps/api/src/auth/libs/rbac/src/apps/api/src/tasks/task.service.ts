@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    private audit: AuditService
  ) {}

  async create(dto, user) {
    const task = this.repo.create({
      ...dto,
      owner: { id: user.id },
      organization: { id: user.organizationId },
    });

    await this.audit.log(user.id, 'CREATE', 'TASK');
    return this.repo.save(task);
  }

  async updateIfAllowed(id: string, user) {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!task) throw new NotFoundException();

    const isOwner = task.owner.id === user.id;
    const isAdmin = user.role !== 'VIEWER';

    if (!isOwner && !isAdmin)
      throw new ForbiddenException();

    await this.audit.log(user.id, 'UPDATE', 'TASK');
    return this.repo.save(task);
  }

  async deleteIfAllowed(id: string, user) {
    if (user.role === 'VIEWER')
      throw new ForbiddenException();

    await this.audit.log(user.id, 'DELETE', 'TASK');
    return this.repo.delete(id);
  }
}
