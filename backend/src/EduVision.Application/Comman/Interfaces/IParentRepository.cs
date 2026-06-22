using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface IParentRepository
{
    Task<List<StudentParent>> GetStudentsAsync(Guid parentId, CancellationToken cancellationToken = default);
}
