# Dark/Light Mode Implementation Guide

This document explains how the dark and light mode system has been implemented in your React project.

## 🌟 Features Implemented

### 1. Theme Context System
- **Location**: `src/context/ThemeContext.tsx`
- **Features**:
  - Global theme state management
  - Persistent theme selection (localStorage)
  - RTL support with Tajawal font
  - Custom color palettes for both modes
  - Material-UI theme integration

### 2. Theme Toggle Component
- **Location**: `src/components/ThemeToggle/ThemeToggle.tsx`
- **Features**:
  - Interactive toggle button with icons
  - Hover animations
  - Tooltip support
  - Customizable size

### 3. Enhanced Styling
- **Updated**: `src/index.css`
- **Features**:
  - CSS custom properties for colors
  - Custom scrollbar styles for both themes
  - Smooth transitions

## 🎨 Color Palette

### Light Mode
- **Background**: `#F9FAFB` (default), `#FFFFFF` (paper)
- **Text**: `#111827` (primary), `#6B7280` (secondary)
- **Primary**: `#2563EB`
- **Secondary**: `#7C3AED`

### Dark Mode
- **Background**: `#0F172A` (default), `#1E293B` (paper)
- **Text**: `#F8FAFC` (primary), `#CBD5E1` (secondary)
- **Primary**: `#60A5FA`
- **Secondary**: `#A78BFA`

## 🚀 How to Use

### 1. Theme Toggle
The theme toggle button is automatically added to the Header component:
```tsx
import ThemeToggle from '../ThemeToggle/ThemeToggle';

// In your component
<ThemeToggle />
```

### 2. Access Theme State
Use the theme hook in any component:
```tsx
import { useThemeMode } from '../context/ThemeContext';

const MyComponent = () => {
  const { mode, toggleColorMode, isDarkMode } = useThemeMode();
  
  return (
    <div>
      Current mode: {isDarkMode ? 'Dark' : 'Light'}
      <button onClick={toggleColorMode}>Toggle Theme</button>
    </div>
  );
};
```

### 3. Theme-Aware Styling
Material-UI components automatically adapt to the theme:
```tsx
<Box sx={{ 
  backgroundColor: 'background.default', // Adapts to theme
  color: 'text.primary',                 // Adapts to theme
  border: '1px solid',
  borderColor: 'divider'                 // Adapts to theme
}}>
  Content
</Box>
```

## 📁 Updated Files

### Core Files
- ✅ `src/context/ThemeContext.tsx` - New theme context
- ✅ `src/components/ThemeToggle/ThemeToggle.tsx` - New toggle component
- ✅ `src/main.tsx` - Updated to use new ThemeProvider
- ✅ `src/App.tsx` - Added theme data attributes
- ✅ `src/index.css` - Enhanced with theme variables

### Component Updates
- ✅ `src/components/Header/Header.tsx` - Added theme toggle
- ✅ `src/components/CourseManagment/CourseManagment.tsx` - Fixed theme usage
- ✅ `src/components/AddNewCourse/NewCourse.tsx` - Fixed theme usage
- ✅ `src/components/Students/Students.tsx` - Fixed theme usage
- ✅ `src/components/EditPage/EditPopover.tsx` - Fixed theme usage
- ✅ `src/components/CourseDel/CourseDel.tsx` - Fixed theme usage
- ✅ `src/components/Aside/ResponsiveDrawer.tsx` - Fixed theme usage

## 🔧 Configuration

### Theme Persistence
The theme preference is automatically saved to localStorage and restored on app reload.

### Default Theme
The system defaults to light mode for new users.

### RTL Support
All themes include proper RTL (Right-to-Left) support for Arabic content.

## 🎯 Benefits

1. **Consistent Experience**: All components automatically adapt to the selected theme
2. **Better Accessibility**: Improved contrast and readability in both modes
3. **User Preference**: Theme selection persists across sessions
4. **Modern Design**: Professional color schemes for both light and dark modes
5. **Performance**: Efficient theme switching with minimal re-renders

## 🐛 Troubleshooting

### If themes don't switch:
1. Check that components use Material-UI's `sx` prop or `useTheme` hook
2. Ensure no hardcoded colors override theme colors
3. Verify ThemeProvider wraps the entire app

### If colors look wrong:
1. Check for CSS specificity conflicts
2. Ensure no inline styles override theme colors
3. Use theme colors instead of hardcoded values

## 🚀 Testing the Implementation

Visit any page and click the theme toggle button in the header to see:
- Background colors change
- Text colors adapt
- Card and paper components update
- Buttons and inputs change appearance
- Scrollbars adapt to the theme

The theme preference will be saved and restored when you refresh the page.
