namespace EduVision.Domain.Entities;

public sealed class StudentParent : BaseEntity
{
    public Guid StudentId { get; private set; }

    public Guid ParentId { get; private set; }

    public User Student { get; private set; } = null!;

    private StudentParent()
    {
    }

    public static StudentParent Create(Guid studentId, Guid parentId)
    {
        if (studentId == Guid.Empty)
            throw new ArgumentException("Student ID cannot be empty.", nameof(studentId));

        if (parentId == Guid.Empty)
            throw new ArgumentException("Parent ID cannot be empty.", nameof(parentId));

        return new StudentParent
        {
            StudentId = studentId,
            ParentId = parentId
        };
    }
}
