import { Key, ReactNode, useLayoutEffect, useRef, useState } from "react";

type OverflowContainerProps<T> = {
  className: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => Key;
  renderOverflow: (overflowNum: number) => ReactNode;
};

export default function OverflowContainer<T>({
  className,
  items,
  renderItem,
  getKey,
  renderOverflow,
}: OverflowContainerProps<T>) {
  const [overflowAmount, setOverflowAmount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current == null) return;

    const observer = new ResizeObserver((entries) => {
      const containerElement = entries[0].target;

      const children =
        containerElement.querySelectorAll<HTMLElement>("[data-item]");
      const overflowElement =
        containerElement.parentElement?.querySelector<HTMLElement>(
          "[data-overflow]"
        );

      // at the beginning, hide the overflow element
      if (overflowElement != null) overflowElement.style.display = "none";
      // by default, all the child should be visible
      children.forEach((child) => child.style.removeProperty("display"));
      // nothing is overflow
      let amount = 0;

      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (containerElement.scrollHeight <= containerElement.clientHeight) {
          break;
        }
        amount++;
        child.style.display = "none";
        overflowElement?.style.removeProperty("display");
      }
      setOverflowAmount(amount);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [items]);

  return (
    <>
      <div className={className} ref={containerRef}>
        {items.map((item) => (
          <div data-item key={getKey(item)}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      <div data-overflow>{renderOverflow(overflowAmount)}</div>
    </>
  );
}
