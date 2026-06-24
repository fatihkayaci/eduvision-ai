using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class StudentProfile
{
    public Guid UserId { get; private set; }
    public string StudentNumber { get; private set; } = string.Empty;
    public ClassEnrollment Enrollment {get; private set;} = null!;
    public User User { get; set; } = null!;

    private StudentProfile()
    {
    }

    public static StudentProfile Create(Guid userId, string studentNumber)
    {
        if (userId == Guid.Empty) throw new DomainValidationException("User ID cannot be empty.");
        if (string.IsNullOrWhiteSpace(studentNumber)) throw new DomainValidationException("Student number cannot be empty.");

        return new StudentProfile
        {
            UserId = userId,
            StudentNumber = studentNumber.Trim()
        };
    }
}
