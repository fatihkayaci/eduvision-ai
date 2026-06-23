using EduVision.Domain.Enums;

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
        if (studentId == Guid.Empty)
            throw new ArgumentException("Student ID cannot be empty.", nameof(studentId));

        if (classroomCourseId == Guid.Empty)
            throw new ArgumentException("ClassroomCourse ID cannot be empty.", nameof(classroomCourseId));

        if (value is < 0 or > 100)
            throw new ArgumentOutOfRangeException(nameof(value), "Grade value must be between 0 and 100.");

        if (examType == ExamType.None)
            throw new ArgumentException("Exam type must be specified.", nameof(examType));

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
