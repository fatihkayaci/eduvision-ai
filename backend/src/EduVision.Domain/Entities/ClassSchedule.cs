using EduVision.Domain.Enums;
using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class ClassSchedule : BaseEntity
{
    public Guid ClassroomCourseId { get; private set; }

    public Guid TermId { get; private set; }

    public Weekday Weekday { get; private set; }

    public TimeOnly StartTime { get; private set; }

    public TimeOnly EndTime { get; private set; }

    public ClassroomCourse ClassroomCourse { get; private set; } = null!;

    private ClassSchedule()
    {
    }

    public static ClassSchedule Create(Guid classroomCourseId, Guid termId, Weekday dayOfWeek, TimeOnly startTime, TimeOnly endTime)
    {
        if (classroomCourseId == Guid.Empty) throw new DomainValidationException("ClassroomCourse ID cannot be empty.");
        if (termId == Guid.Empty) throw new DomainValidationException("Term ID cannot be empty.");
        if (endTime <= startTime) throw new DomainValidationException("End time must be after start time.");

        return new ClassSchedule
        {
            ClassroomCourseId = classroomCourseId,
            TermId = termId,
            Weekday = dayOfWeek,
            StartTime = startTime,
            EndTime = endTime,
        };
    }
}
