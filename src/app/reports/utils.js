export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const SHIFT_CONFIG = {
  morning: { label: 'Shift 1', start: '06:00 AM', end: '12:00 PM', startMins: 360, endMins: 720 },
  evening: { label: 'Shift 2', start: '12:00 PM', end: '06:00 PM', startMins: 720, endMins: 1080 },
  night:   { label: 'Shift 3', start: '06:00 PM', end: '06:00 AM', startMins: 1080, endMins: 360 }
};

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  
  let [_, hours, minutes, modifier] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  modifier = modifier.toUpperCase();

  if (minutes < 0 || minutes >= 60) return null;
  if (hours < 1 || hours > 12) return null;

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

export const formatDate = (date) => {
  if (!date) return 'Select Date';
  return `${monthsShort[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
};

export const getCurrentShift = () => {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  
  if (mins >= SHIFT_CONFIG.morning.startMins && mins < SHIFT_CONFIG.morning.endMins) return SHIFT_CONFIG.morning.label;
  if (mins >= SHIFT_CONFIG.evening.startMins && mins < SHIFT_CONFIG.evening.endMins) return SHIFT_CONFIG.evening.label;
  return SHIFT_CONFIG.night.label;
};

export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
export const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export const formatDateForBackend = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTimeForBackend = (timeStr) => {
  if (!timeStr) return null;
  // More flexible regex: optional space before AM/PM, casing, optional modifier
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  
  let [_, hours, minutes, modifier] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  modifier = (modifier || '').toUpperCase();

  if (minutes < 0 || minutes >= 60) return null;
  if (modifier && (hours < 1 || hours > 12)) return null;
  if (!modifier && (hours < 0 || hours > 23)) return null;

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};

export const mapShiftForBackend = (shiftName) => {
  if (!shiftName) return null;
  const entry = Object.entries(SHIFT_CONFIG).find(([_, config]) => config.label === shiftName);
  return entry ? entry[0] : null;
};

export const convertTo24Hour = (time12h) => {
  if (!time12h) return '';
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';
  
  let [_, hours, minutes, modifier] = match;
  hours = parseInt(hours);
  modifier = modifier.toUpperCase();

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

export const convertTo12Hour = (time24h) => {
  if (!time24h) return '';
  const [hours, minutes] = time24h.split(':');
  let h = parseInt(hours);
  const m = minutes;
  const modifier = h >= 12 ? 'PM' : 'AM';
  
  h = h % 12;
  if (h === 0) h = 12;
  
  return `${String(h).padStart(2, '0')}:${m} ${modifier}`;
};

export const extractPayloadText = (payload) => {
  if (!payload) return '-';
  
  // Case 1: Old structure or direct "read_value" / "read"
  const directRead = payload.read_value || payload.read;
  if (directRead && typeof directRead === 'string' && directRead !== '-' && directRead.trim() !== '') {
     return directRead;
  }

  // Case 2: New nested structure with classes 0, 1, 2...
  let texts = [];
  
  // Recursive search for "text" properties
  const findTexts = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    // If it's a leaf object with a "text" property
    if (Object.prototype.hasOwnProperty.call(obj, 'text')) {
      if (obj.text !== undefined && obj.text !== null && obj.text !== '') {
        texts.push(String(obj.text));
      }
      return; 
    }
    
    // Continue traversing
    Object.values(obj).forEach(val => {
      if (val && typeof val === 'object') {
        findTexts(val);
      }
    });
  };

  findTexts(payload);
  
  // Return joined texts or fallback to directRead or '-'
  return texts.length > 0 ? texts.join(', ') : (directRead || '-');
};
