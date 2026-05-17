const fs = require('fs');
const file = 'src/components/Interests.jsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add mobileAlignment to HoverItem props
code = code.replace(
  `const HoverItem = ({ label, children, tooltipClassName = "", onClickAction }) => {`,
  `const HoverItem = ({ label, children, tooltipClassName = "", onClickAction, mobileAlignment = "center" }) => {`
);

// 2. Add alignmentClasses mapping
const oldClassStart = `className={\`transition-all duration-300 transform absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-xl pointer-events-none z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-100 \${isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'`;
const oldClassFull = oldClassStart + `\n                    } \${tooltipClassName}\`}`;

const newClassCode = `    const alignmentClasses = {
        center: "-translate-x-1/2 after:left-1/2",
        left: "-translate-x-[15%] sm:-translate-x-1/2 after:left-[15%] sm:after:left-1/2",
        right: "-translate-x-[85%] sm:-translate-x-1/2 after:left-[85%] sm:after:left-1/2",
    }[mobileAlignment] || "-translate-x-1/2 after:left-1/2";

    return (
        <button
            ref={itemRef}
            type="button"
            aria-expanded={isOpen}
            className={\`relative inline-block \${onClickAction ? 'cursor-pointer' : 'cursor-help'} underline decoration-wavy decoration-gray-300 dark:decoration-gray-600 hover:decoration-gray-900 dark:hover:decoration-gray-100 underline-offset-2 transition-all duration-200 rounded-md px-1.5 py-0.5 -mx-1.5 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-400\`}
            onMouseEnter={() => {
                // Ignore mouse enter if we recently processed a touch event (fixes iOS double-firing)
                if (touchTimeoutRef.current) return;
                setIsOpen(true);
            }}
            onMouseLeave={() => {
                if (touchTimeoutRef.current) return;
                setIsOpen(false);
            }}
            onTouchStart={() => {
                // Set a flag that a touch started, clear it after a delay
                touchTimeoutRef.current = setTimeout(() => {
                    touchTimeoutRef.current = null;
                }, 500);
            }}
            onClick={handleInteraction}
        >
            <span>{label}</span>
            <div
                className={\`transition-all duration-300 transform absolute bottom-full left-1/2 mb-3 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-xl pointer-events-none z-50 after:content-[''] after:absolute after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900 dark:after:border-t-gray-100 \${alignmentClasses} \${isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'} \${tooltipClassName}\`}
            >
                {children}
            </div>
        </button>
    );`;

// We need to replace the entire return statement to be safe
const returnStart = `    return (
        <button
            ref={itemRef}`;
const returnEnd = `                {children}
            </div>
        </button>
    );`;

const codeParts = code.split(returnStart);
const returnEndParts = codeParts[1].split(returnEnd);

code = codeParts[0] + newClassCode + returnEndParts[1];

// 3. Add mobileAlignment to InterestWithMedia
code = code.replace(
  `const InterestWithMedia = ({ label, media }) => {`,
  `const InterestWithMedia = ({ label, media, mobileAlignment = "center" }) => {`
);

code = code.replace(
  `<HoverItem label={label} tooltipClassName="min-w-[200px] px-2 py-2">`,
  `<HoverItem label={label} tooltipClassName="min-w-[200px] px-2 py-2" mobileAlignment={mobileAlignment}>`
);

// 4. Update the actual usages
code = code.replace(
  `<InterestWithMedia label="Rock Climbing" media="/rock-climb-compressed.mp4" />`,
  `<InterestWithMedia label="Rock Climbing" media="/rock-climb-compressed.mp4" mobileAlignment="left" />`
);

code = code.replace(
  `<HoverItem
                        label="Web Browsers"
                        tooltipClassName="px-3 py-2 text-white dark:text-gray-900 text-xs text-center whitespace-nowrap w-max"
                    >`,
  `<HoverItem
                        label="Web Browsers"
                        tooltipClassName="px-3 py-2 text-white dark:text-gray-900 text-xs text-center whitespace-nowrap w-max"
                        mobileAlignment="left"
                    >`
);

fs.writeFileSync(file, code);
console.log('Done!');
