using EduVision.Domain.Enums;
using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class Grade : BaseEntity
{
    public Guid StudentId { get; private set; }

    public Guid ClassroomCourseId { get; private set; }

    public decimal Value { get; private set; }

    public ExamType ExamType { get; private set; }

    public DateOnly Date { get; private set; }

    private Grade()
    {
    }

    public static Grade Create(Guid studentId, Guid classroomCourseId, decimal value, ExamType examType, DateOnly date)
    {
        if (studentId == Guid.Empty) throw new DomainValidationException("Student ID cannot be empty.");
        if (classroomCourseId == Guid.Empty) throw new DomainValidationException("ClassroomCourse ID cannot be empty.");
        if (value is < 0 or > 100) throw new DomainValidationException("Grade value must be between 0 and 100.");
        if (examType == ExamType.None) throw new DomainValidationException("Exam type must be specified.");

        return new Grade
        {
            StudentId = studentId,
            ClassroomCourseId = classroomCourseId,
            Value = value,
            ExamType = examType,
            Date = date
        };
    }
}
