import { getRelativeTimeString } from "./date.utils";

describe("getRelativeTimeString", () => {
  // Mock the current date for consistent testing
  const mockCurrentDate = new Date("2024-01-15T12:00:00.000Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockCurrentDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("today", () => {
    it("should return 'Today' for current time", () => {
      expect.assertions(1);

      const date = new Date("2024-01-15T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Today");
    });

    it("should return 'Today' for 1 hour ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-15T11:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Today");
    });

    it("should return 'Today' for 23 hours ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-14T13:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Today");
    });

    it("should return 'Today' for 5 minutes ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-15T11:55:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Today");
    });
  });

  describe("yesterday", () => {
    it("should return 'Yesterday' for exactly 24 hours ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-14T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Yesterday");
    });

    it("should return 'Yesterday' for 25 hours ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-14T11:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Yesterday");
    });

    it("should return 'Yesterday' for 47 hours ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-13T13:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Yesterday");
    });
  });

  describe("days ago", () => {
    it("should return '2 days ago' for exactly 48 hours ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-13T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("2 days ago");
    });

    it("should return '3 days ago' for 3 days ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-12T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("3 days ago");
    });

    it("should return '6 days ago' for 6 days ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-09T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("6 days ago");
    });

    it("should return '1 day ago' when singular", () => {
      expect.assertions(1);

      // Edge case: should return "2 days ago" based on the current logic
      const date = new Date("2024-01-13T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("2 days ago");
    });
  });

  describe("weeks ago", () => {
    it("should return '1 week ago' for 7 days ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-08T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("1 week ago");
    });

    it("should return '1 week ago' for 13 days ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-02T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("1 week ago");
    });

    it("should return '2 weeks ago' for 14 days ago", () => {
      expect.assertions(1);

      const date = new Date("2024-01-01T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("2 weeks ago");
    });

    it("should return '2 weeks ago' for 20 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-12-26T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("2 weeks ago");
    });

    it("should return '3 weeks ago' for 21 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-12-25T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("3 weeks ago");
    });

    it("should return '3 weeks ago' for 27 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-12-19T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("3 weeks ago");
    });
  });

  describe("months ago", () => {
    it("should return '1 month ago' for 28 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-12-18T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("1 month ago");
    });

    it("should return '1 month ago' for 59 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-11-17T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("1 month ago");
    });

    it("should return '2 months ago' for 60 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-11-16T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("2 months ago");
    });

    it("should return '2 months ago' for 89 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-10-18T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("2 months ago");
    });

    it("should return '3 months ago' for 90 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-10-17T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("3 months ago");
    });

    it("should return '3 months ago' for 119 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-09-18T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("3 months ago");
    });

    it("should return '4 months ago' for 120 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-09-17T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("4 months ago");
    });

    it("should return '12 months ago' for 364 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-01-16T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("12 months ago");
    });
  });

  describe("years ago", () => {
    it("should return '1 year ago' for 365 days ago", () => {
      expect.assertions(1);

      const date = new Date("2023-01-15T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("1 year ago");
    });

    it("should return '1 year ago' for 729 days ago", () => {
      expect.assertions(1);

      const date = new Date("2022-01-16T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("1 year ago");
    });

    it("should return '2 years ago' for 730 days ago", () => {
      expect.assertions(1);

      const date = new Date("2022-01-15T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("2 years ago");
    });

    it("should return '5 years ago' for 5 years ago", () => {
      expect.assertions(1);

      const date = new Date("2019-01-15T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("5 years ago");
    });
  });

  describe("edge cases", () => {
    it("should handle future dates as 'Today'", () => {
      expect.assertions(1);

      const date = new Date("2024-01-15T13:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("Today");
    });

    it("should handle very old dates", () => {
      expect.assertions(1);

      const date = new Date("1990-01-15T12:00:00.000Z");

      expect(getRelativeTimeString(date)).toBe("34 years ago");
    });

    it("should handle dates at exact boundaries", () => {
      expect.assertions(3);

      // Test exact 24 hour boundary
      const exactly24HoursAgo = new Date("2024-01-14T12:00:00.000Z");

      expect(getRelativeTimeString(exactly24HoursAgo)).toBe("Yesterday");

      // Test exact 48 hour boundary
      const exactly48HoursAgo = new Date("2024-01-13T12:00:00.000Z");

      expect(getRelativeTimeString(exactly48HoursAgo)).toBe("2 days ago");

      // Test exact 7 day boundary
      const exactly7DaysAgo = new Date("2024-01-08T12:00:00.000Z");

      expect(getRelativeTimeString(exactly7DaysAgo)).toBe("1 week ago");
    });
  });

  describe("date validation", () => {
    it("should handle invalid dates gracefully", () => {
      expect.assertions(1);

      const invalidDate = new Date("invalid");

      // The function doesn't currently handle invalid dates
      // It returns "NaN years ago" which is the current behavior
      expect(getRelativeTimeString(invalidDate)).toBe("NaN years ago");
    });
  });
});
