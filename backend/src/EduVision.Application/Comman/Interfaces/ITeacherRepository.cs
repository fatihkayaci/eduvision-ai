using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface ITeacherRepository
{
    Task<List<ClassroomCourse>> GetCoursesAsync(Guid teacherId, CancellationToken cancellationToken = default);
}
