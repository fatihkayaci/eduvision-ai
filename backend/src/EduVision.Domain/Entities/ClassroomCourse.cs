using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class ClassroomCourse : BaseEntity
{
    public Guid ClassRoomId { get; private set; }

    public Guid CourseId { get; private set; }

    public Guid TeacherId { get; private set; }

    public ClassRoom ClassRoom { get; private set; } = null!;

    public Course Course { get; private set; } = null!;

    public ICollection<Grade> Grades { get; private set; } = [];

    private ClassroomCourse()
    {
    }

    public static ClassroomCourse Create(Guid classRoomId, Guid courseId, Guid teacherId)
    {
        if (classRoomId == Guid.Empty) throw new DomainValidationException("ClassRoom ID cannot be empty.");
        if (courseId == Guid.Empty) throw new DomainValidationException("Course ID cannot be empty.");
        if (teacherId == Guid.Empty) throw new DomainValidationException("Teacher ID cannot be empty.");

        return new ClassroomCourse
        {
            ClassRoomId = classRoomId,
            CourseId = courseId,
            TeacherId = teacherId
        };
    }
}
