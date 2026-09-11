export interface MenuItemStorageMetadata {
  recordId?: string;
  sourceIndex: number;
}

const menuItemStorage = Symbol("menuItemStorage");

export function getMenuItemStorageMetadata(
  item: unknown,
): MenuItemStorageMetadata | undefined {
  if (!item || typeof item !== "object") return undefined;
  return (item as { [menuItemStorage]?: MenuItemStorageMetadata })[
    menuItemStorage
  ];
}

export function setMenuItemStorageMetadata<T extends object>(
  item: T,
  metadata: MenuItemStorageMetadata,
): T {
  Object.defineProperty(item, menuItemStorage, {
    configurable: true,
    enumerable: false,
    value: { ...metadata },
  });
  return item;
}

export function copyMenuItemStorageMetadata<T extends object>(
  source: unknown,
  target: T,
): T {
  const metadata = getMenuItemStorageMetadata(source);
  return metadata ? setMenuItemStorageMetadata(target, metadata) : target;
}
