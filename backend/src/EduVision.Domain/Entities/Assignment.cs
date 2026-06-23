using EduVision.Domain.Enums;

namespace EduVision.Domain.Entities;

public sealed class Assignment : BaseEntity
{
    public Guid ClassRoomId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public AssignmentType Type { get; private set; }

    public string? FileUrl { get; private set; }

    public DateOnly StartDate { get; private set; }

    public DateOnly DueDate { get; private set; }

    public ClassRoom ClassRoom { get; private set; } = null!;

    private Assignment()
    {
    }

    public static Assignment Create(
        Guid classRoomId,
        string title,
        AssignmentType type,
        DateOnly startDate,
        DateOnly dueDate,
        string? description = null,
        string? fileUrl = null)
    {
        if (classRoomId == Guid.Empty)
            throw new ArgumentException("ClassRoom ID cannot be empty.", nameof(classRoomId));

        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        if (type == default)
            throw new ArgumentException("Assignment type must be specified.", nameof(type));

        if (dueDate < startDate)
            throw new ArgumentException("Due date cannot be before start date.", nameof(dueDate));

        return new Assignment
        {
            ClassRoomId = classRoomId,
            Title = title.Trim(),
            Description = description?.Trim(),
            Type = type,
            FileUrl = fileUrl,
            StartDate = startDate,
            DueDate = dueDate,
        };
    }
}
