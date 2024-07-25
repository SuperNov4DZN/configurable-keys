using SPT.Reflection;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using EFT;
using System.Runtime.CompilerServices;
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
