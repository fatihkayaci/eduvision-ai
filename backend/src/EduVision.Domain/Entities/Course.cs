using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class Course : BaseEntity
{
    public string Name { get; private set; } = string.Empty;

    private Course()
    {
    }

    public static Course Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new DomainValidationException("Course name cannot be empty.");

        return new Course
        {
            Name = name.Trim()
        };
    }
}
