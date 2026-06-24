using EduVision.Domain.Enums;
using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class Attendance : BaseEntity
{
    public Guid StudentId { get; private set; }

    public Guid TermId { get; private set; }

    public DateOnly Date { get; private set; }

    public AttendanceType Type { get; private set; }

    public string? Note { get; private set; }

    private Attendance()
    {
    }

    public static Attendance Create(Guid studentId, Guid termId, DateOnly date, AttendanceType type, string? note = null)
    {
        if (studentId == Guid.Empty) throw new DomainValidationException("Student ID cannot be empty.");
        if (termId == Guid.Empty) throw new DomainValidationException("Term ID cannot be empty.");
        if (type == default) throw new DomainValidationException("Attendance type must be specified.");

        return new Attendance
        {
            StudentId = studentId,
            TermId = termId,
            Date = date,
            Type = type,
            Note = note,
        };
    }
}
