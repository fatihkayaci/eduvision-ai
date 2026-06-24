using EduVision.Domain.Enums;
using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class Assignment : BaseEntity
{
    public Guid ClassRoomId { get; private set; }

    public Guid TermId { get; private set; }

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
        Guid termId,
        string title,
        AssignmentType type,
        DateOnly startDate,
        DateOnly dueDate,
        string? description = null,
        string? fileUrl = null)
    {
        if (classRoomId == Guid.Empty) throw new DomainValidationException("ClassRoom ID cannot be empty.");
        if (termId == Guid.Empty) throw new DomainValidationException("Term ID cannot be empty.");
        if (string.IsNullOrWhiteSpace(title)) throw new DomainValidationException("Assignment title cannot be empty.");
        if (type == default) throw new DomainValidationException("Assignment type must be specified.");
        if (dueDate < startDate) throw new DomainValidationException("Due date cannot be before start date.");

        return new Assignment
        {
            ClassRoomId = classRoomId,
            TermId = termId,
            Title = title.Trim(),
            Description = description?.Trim(),
            Type = type,
            FileUrl = fileUrl,
            StartDate = startDate,
            DueDate = dueDate,
        };
    }
}
