CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  researcher_id INTEGER NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'planned',
  budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_projects_researcher
    FOREIGN KEY (researcher_id)
    REFERENCES researchers(id),

  CONSTRAINT chk_projects_status
    CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),

  CONSTRAINT chk_projects_budget
    CHECK (budget >= 0),

  CONSTRAINT chk_projects_dates
    CHECK (end_date IS NULL OR end_date >= start_date)
);
