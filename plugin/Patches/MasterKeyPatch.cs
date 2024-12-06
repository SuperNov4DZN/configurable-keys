using System.Reflection;
using EFT;
using SPT.Reflection.Patching;
using configurable_keys.Scripts;

namespace configurable_keys.Patches
{
    internal class MasterKeyPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return typeof(GameWorld).GetMethod("OnGameStarted", BindingFlags.Public | BindingFlags.Instance);
        }

        [PatchPostfix]
        private static void Postfix() 
        {
            MasterKeyScript masterKey = new MasterKeyScript();

            masterKey.Start();
        }
    }
}
