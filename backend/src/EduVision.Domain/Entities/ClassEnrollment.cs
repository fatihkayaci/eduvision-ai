namespace EduVision.Domain.Entities;

public sealed class ClassEnrollment : BaseEntity
{
    public Guid ClassRoomId { get; private set; }

    public Guid StudentId { get; private set; }

    public ClassRoom ClassRoom { get; private set; } = null!;

    private ClassEnrollment()
    {
    }

    public static ClassEnrollment Create(Guid classRoomId, Guid studentId)
    {
        if (classRoomId == Guid.Empty)
            throw new ArgumentException("ClassRoom ID cannot be empty.", nameof(classRoomId));

        if (studentId == Guid.Empty)
            throw new ArgumentException("Student ID cannot be empty.", nameof(studentId));

        return new ClassEnrollment
        {
            ClassRoomId = classRoomId,
            StudentId = studentId
        };
    }
}
