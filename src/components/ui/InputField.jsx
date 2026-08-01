import React, { forwardRef } from 'react';

const InputField = forwardRef(({ 
  label, 
  id, 
  error, 
  className = '', 
  labelClassName = 'text-fluid-sm',
  ...props 
}, ref) => {
  const hasError = !!error;
  
  return (
    <div>
      <label htmlFor={id} className={`block font-medium text-slate-600 dark:text-slate-400 mb-1 transition-colors ${labelClassName}`}>
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={`input-field ${hasError ? 'border-danger focus:border-danger focus:ring-0 bg-danger/5 dark:bg-danger/10' : ''} ${className}`}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${id}-error` : undefined}
        {...props}
      />
      {error !== undefined && (
        <div id={`${id}-error`} role="alert" className={`overflow-hidden transform-gpu transition-all duration-300 ease-in-out ${hasError ? 'max-h-12 mt-1.5 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-danger/90 text-[11px] lg:text-xs xl:text-fluid-xs font-medium tracking-wide px-1 pb-1 leading-normal whitespace-nowrap" title={error}>
            {error}
          </p>
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
