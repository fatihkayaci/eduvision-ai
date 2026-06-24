using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface ITermRepository
{
    Task<List<Term>> GetBySchoolIdAsync(Guid schoolId, CancellationToken cancellationToken = default);
}
