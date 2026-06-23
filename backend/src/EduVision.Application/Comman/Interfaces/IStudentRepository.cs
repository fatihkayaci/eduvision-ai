using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface IStudentRepository
{
    Task<StudentProfile?> GetProfileAsync(Guid studentId, CancellationToken cancellationToken = default);
}
