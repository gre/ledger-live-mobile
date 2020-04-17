// @flow
import { log } from "@ledgerhq/logs";
import store from "react-native-simple-store";
import { atomicQueue } from "@ledgerhq/live-common/lib/promise";
import type { AccountRaw } from "@ledgerhq/live-common/lib/types";

const ACCOUNTS_KEY = "accounts";
const ACCOUNTS_DB_PREFIX = "accounts.active.";

export async function clearDb() {
  await store.delete(["settings", "accounts", "countervalues", "ble"]);
}

export async function getUser(): Promise<{ id: string }> {
  const user = await store.get("user");
  return user;
}

export async function setUser(user: { id: string }): Promise<void> {
  await store.update("user", user);
}

export async function getSettings(): Promise<*> {
  const settings = await store.get("settings");
  return settings;
}

export async function saveSettings(obj: *): Promise<void> {
  await store.save("settings", obj);
}

export async function getCountervalues(): Promise<*> {
  const countervalues = await store.get("countervalues");
  return countervalues;
}

export async function saveCountervalues(obj: *): Promise<void> {
  await store.save("countervalues", obj);
}

export async function getBle(): Promise<*> {
  const ble = await store.get("ble");
  return ble;
}

export async function saveBle(obj: *): Promise<void> {
  await store.save("ble", obj);
}

const formatAccountDBKey = (id: string): string => `${ACCOUNTS_DB_PREFIX}${id}`;

/** get Db accounts keys */
function getAccountsKeys(): Promise<Array<string>> {
  return store.keys().then(keys => {
    /** filter through them to get only the accounts ones */
    return keys.filter(key => key.indexOf(ACCOUNTS_DB_PREFIX) === 0);
  });
}

// get accounts specific method to aggregate all account keys into the correct format
async function unsafeGetAccounts(): Promise<{ active: AccountRaw[] }> {
  await migrateAccountsIfNecessary();

  const accountKeys = await getAccountsKeys();

  // if some account keys, we retrieve them and return
  if (accountKeys && accountKeys.length > 0) {
    const active = await store.get(accountKeys);
    return { active };
  }

  // fallback to empty state
  return { active: [] };
}

/** save accounts method between SQLite db and redux store persist */
async function unsafeSaveAccounts(
  {
    active: newAccounts,
  }: {
    active: any[],
  },
  stats?: ?{
    changed: string[],
  },
): Promise<void> {
  log("db", "saving accounts...");
  const currentAccountKeys = await getAccountsKeys();
  /** format data for DB persist */
  const dbData = newAccounts.map(({ data }) => [
    formatAccountDBKey(data.id),
    { data, version: 1 },
  ]);

  /** Find current DB accounts keys diff with app state to remove them */
  const deletedKeys =
    currentAccountKeys && currentAccountKeys.length
      ? currentAccountKeys.filter(key =>
          dbData.every(([accountKey]) => accountKey !== key),
        )
      : [];

  // we only save those who effectively changed
  const dbDataWithOnlyChanges = !stats
    ? dbData
    : dbData.filter(([_key, { data }]) => stats.changed.includes(data.id));

  /** persist store data to DB */
  await store.save(dbDataWithOnlyChanges);

  /** then delete potential removed keys */
  if (deletedKeys.length > 0) {
    await store.delete(deletedKeys);
  }
  log(
    "db",
    "saved " +
      dbDataWithOnlyChanges.length +
      " accounts" +
      (deletedKeys.length ? " and deleted " + deletedKeys.length : ""),
  );
}

export const getAccounts: typeof unsafeGetAccounts = atomicQueue(
  unsafeGetAccounts,
);
export const saveAccounts: typeof unsafeSaveAccounts = atomicQueue(
  unsafeSaveAccounts,
);

/** migrate accounts data if necessary */
async function migrateAccountsIfNecessary(): Promise<void> {
  const keys = await store.keys();

  /** check if old data is present */
  const hasOldAccounts = keys.includes(ACCOUNTS_KEY);
  if (hasOldAccounts) {
    log("db", "should migrateAccountsIfNecessary");
    /** fetch old accounts db data */
    const oldAccounts = await store.get(ACCOUNTS_KEY);
    /** format old data to be saved on an account based key */
    const accountsData = (oldAccounts && oldAccounts.active) || [];

    const newDBData = accountsData.map(({ data }) => [
      formatAccountDBKey(data.id),
      { data, version: 1 },
    ]);
    /** save new formatted data then remove old data from DB */
    await store.save(newDBData);
    await store.delete(ACCOUNTS_KEY);
    log("db", "done migrateAccountsIfNecessary");
  }
}
