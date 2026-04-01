-- ============================================================
--  Travel Itinerary Planner — Database Schema
--  Compatible with: Microsoft SQL Server / Azure SQL Database
-- ============================================================

-- Uncomment and run the following two lines if you need to
-- create the database from scratch:
-- CREATE DATABASE TravelPlannerDB;
-- GO

-- USE TravelPlannerDB;
-- GO

-- ─── Trips ───────────────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM sysobjects WHERE name = 'Trips' AND xtype = 'U'
)
BEGIN
  CREATE TABLE Trips (
    id          INT           IDENTITY(1,1) PRIMARY KEY,
    destination NVARCHAR(255) NOT NULL,
    startDate   DATE          NOT NULL,
    endDate     DATE          NOT NULL,
    createdAt   DATETIME      NOT NULL DEFAULT GETDATE(),

    CONSTRAINT CK_Trips_Dates CHECK (endDate >= startDate)
  );

  PRINT 'Table [Trips] created.';
END
ELSE
BEGIN
  PRINT 'Table [Trips] already exists — skipped.';
END
GO

-- ─── Activities ──────────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM sysobjects WHERE name = 'Activities' AND xtype = 'U'
)
BEGIN
  CREATE TABLE Activities (
    id           INT           IDENTITY(1,1) PRIMARY KEY,
    tripId       INT           NOT NULL,
    title        NVARCHAR(255) NOT NULL,
    activityDate DATE          NOT NULL,
    notes        NVARCHAR(MAX) NULL,
    createdAt    DATETIME      NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Activities_Trips
      FOREIGN KEY (tripId) REFERENCES Trips(id) ON DELETE CASCADE
  );

  PRINT 'Table [Activities] created.';
END
ELSE
BEGIN
  PRINT 'Table [Activities] already exists — skipped.';
END
GO

-- ─── Indexes ─────────────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_Activities_TripId' AND object_id = OBJECT_ID('Activities')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Activities_TripId
    ON Activities (tripId);

  PRINT 'Index [IX_Activities_TripId] created.';
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_Trips_CreatedAt' AND object_id = OBJECT_ID('Trips')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Trips_CreatedAt
    ON Trips (createdAt DESC);

  PRINT 'Index [IX_Trips_CreatedAt] created.';
END
GO

-- ─── Sample Data (optional — remove in production) ───────────

/*
INSERT INTO Trips (destination, startDate, endDate)
VALUES
  (N'Tokyo, Japan',    '2024-03-01', '2024-03-15'),
  (N'Paris, France',   '2024-06-10', '2024-06-20'),
  (N'Bali, Indonesia', '2024-09-05', '2024-09-18');

INSERT INTO Activities (tripId, title, activityDate, notes)
VALUES
  (1, N'Visit Senso-ji Temple',    '2024-03-02', N'Arrive early to beat the crowds'),
  (1, N'Shibuya Crossing walk',    '2024-03-03', N'Best at night — very photogenic'),
  (2, N'Eiffel Tower at sunset',   '2024-06-11', N'Book tickets in advance online'),
  (2, N'Louvre Museum morning',    '2024-06-12', N'Skip-the-line pass recommended');
*/
