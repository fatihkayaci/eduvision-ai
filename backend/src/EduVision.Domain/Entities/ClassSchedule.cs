using EduVision.Domain.Enums;

namespace EduVision.Domain.Entities;

public sealed class ClassSchedule : BaseEntity
{
    public Guid ClassroomCourseId { get; private set; }

    public Weekday Weekday { get; private set; }

    public TimeOnly StartTime { get; private set; }

    public TimeOnly EndTime { get; private set; }

    public ClassroomCourse ClassroomCourse { get; private set; } = null!;

    private ClassSchedule()
    {
    }

    public static ClassSchedule Create(Guid classroomCourseId, Weekday dayOfWeek, TimeOnly startTime, TimeOnly endTime)
    {
        if (classroomCourseId == Guid.Empty)
            throw new ArgumentException("ClassroomCourse ID cannot be empty.", nameof(classroomCourseId));

        if (endTime <= startTime)
            throw new ArgumentException("End time must be after start time.", nameof(endTime));

        return new ClassSchedule
        {
            ClassroomCourseId = classroomCourseId,
            Weekday = dayOfWeek,
            StartTime = startTime,
            EndTime = endTime,
        };
    }
}
