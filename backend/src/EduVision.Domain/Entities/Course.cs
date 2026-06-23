namespace EduVision.Domain.Entities;

public sealed class Course : BaseEntity
{
    public string Name { get; private set; } = string.Empty;

    private Course()
    {
    }

    public static Course Create(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new Course
        {
            Name = name.Trim()
        };
    }
}
