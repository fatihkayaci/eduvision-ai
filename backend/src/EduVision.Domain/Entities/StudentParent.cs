using EduVision.Domain.Exceptions;

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
        if (studentId == Guid.Empty) throw new DomainValidationException("Student ID cannot be empty.");
        if (parentId == Guid.Empty) throw new DomainValidationException("Parent ID cannot be empty.");

        return new StudentParent
        {
            StudentId = studentId,
            ParentId = parentId
        };
    }
}
