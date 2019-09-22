pragma solidity ^0.4.18;

contract Application {
    function Application() public {}

    function Review_Pedigree (
        string Pedigree_TagID,
        uint Date_Reviewed,
        string Pedigree_Manager,
        string Job_To_Do,
        string Review_Comments,
        bytes32 assetId,
        bytes32 Pedigree)
    public {}

    function Procure_Vaccination_Service (
        string Veterinarian_TagID,
        string Pedigree_Manager,
        string Job_To_Do,
        uint Date_Procured,
        bytes32 assetId,
        bytes32 Pedigree)
    public {}

    function Register_Pedigree (
        string Pedigree_TagID,
        string Pedigree_CodeName,
        bytes32 assetId,
        bytes32 Pedigree)
    public {}
}
