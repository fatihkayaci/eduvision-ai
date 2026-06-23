namespace EduVision.Domain.Entities;

public sealed class ClassroomCourse : BaseEntity
{
    public Guid ClassRoomId { get; private set; }

    public Guid CourseId { get; private set; }

    public Guid TeacherId { get; private set; }

    public ClassRoom ClassRoom { get; private set; } = null!;

    public Course Course { get; private set; } = null!;

    private ClassroomCourse()
    {
    }

    public static ClassroomCourse Create(Guid classRoomId, Guid courseId, Guid teacherId)
    {
        if (classRoomId == Guid.Empty)
            throw new ArgumentException("ClassRoom ID cannot be empty.", nameof(classRoomId));

        if (courseId == Guid.Empty)
            throw new ArgumentException("Course ID cannot be empty.", nameof(courseId));

        if (teacherId == Guid.Empty)
            throw new ArgumentException("Teacher ID cannot be empty.", nameof(teacherId));

        return new ClassroomCourse
        {
            ClassRoomId = classRoomId,
            CourseId = courseId,
            TeacherId = teacherId
        };
    }
}
