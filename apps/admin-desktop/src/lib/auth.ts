type Session = {
  token: string;
  employeeCode: string;
};

let currentSession: Session | null = null;

export const authStore = {
  get() {
    return currentSession;
  },
  set(session: Session) {
    currentSession = session;
  },
  clear() {
    currentSession = null;
  },
  describe() {
    return currentSession ? `Signed in as ${currentSession.employeeCode}` : 'In-memory session mode';
  }
};
